const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone } = req.body;
  const { idDocument, bankStatement } = req.files; 
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number format. Please include a valid country code." });
  }

  let user = await User.findOne({ where: { email } });
  if (user) {
    if (user.otpExpire > Date.now()) {
      return res.status(400).json({ message: "OTP is still valid. Please check your email." });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpire = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    const message = `Your new OTP for registration is ${otp}. It will expire in 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: "OTP for User Registration - Resend",
      message,
    });

    return res.status(200).json({
      success: true,
      message: "New OTP sent to your email.",
    });
  }

  user = await User.create({
    name,
    email,
    password,
    confirmPassword,
    phone,
    status: "active",
    registrationDate: Date.now(),
    registrationDate: Date.now(), // Set registration date,
    idDocument: idDocument ? idDocument[0].path : null,  
    bankStatement: bankStatement ? bankStatement[0].path : null
  });

  const otp = crypto.randomInt(100000, 999999);
  const otpExpire = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpire = otpExpire;
  await user.save();

  const message = `Your OTP for registration is ${otp}. It will expire in 10 minutes.`;
  await sendEmail({
    email: user.email,
    subject: "OTP for User Registration",
    message,
  });
  
  res.status(201).json({
    user,
    message: "User registered successfully. OTP sent to your email.",
  });
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHander("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (user.status === "banned") {
    return next(new ErrorHander("Your account has been banned. You cannot log in.", 403));
  }

  if (user.isBlocked) {
    return next(new ErrorHander("Your account is blocked. Please contact support.", 403));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  await user.addActivityLog("User login");
  sendToken(user, 200, res);
});


  
//   // Google Authentication Endpoint
// exports.googleLogin = catchAsyncErrors(async (req, res, next) => {
//     const { token } = req.body;
  
//     if (!token) {
//       return res.status(400).json({ message: "Token is required" });
//     }
  
//     // Verify the token with Google's API
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
  
//     const payload = ticket.getPayload();
//     const { email, name, picture, sub: googleId } = payload;
  
//     // Check if the user already exists in MongoDB
//     let user = await User.findOne({ email });
  
//     if (!user) {
//       // Register the user if they don't exist
//       user = await User.create({
//         name,
//         email,
//         googleId,
//         avatar: picture,
//         status: "active",
//         registrationDate: new Date(),
//       });
  
//       console.log("User registered via Google");
//     } else {
//       // Log user activity if already exists
//       console.log("User logged in via Google");
//     }
  
//     // Generate a JWT token for the user
//     const sessionToken = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );
  
//     // Respond with the session token and user info
//     res.status(200).json({
//       success: true,
//       token: sessionToken,
//       user,
//       message: "Login successful",
//     });
//   });
   


// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
 
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
     user.activityLogs("forgot password")
    try {
      await sendEmail({
        email: user.email,
        subject: `Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHander(error.message, 500));
    }
  });
  
  // Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
    }
  
    // Validate new password and confirm password
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHander("Passwords do not match", 400));
    }
  
    // Check password strength (optional security check)
    const passwordStrength = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordStrength.test(req.body.password)) {
      return next(new ErrorHander("Password must be at least 6 characters long and contain at least one letter and one number.", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res); // Assuming you have sendToken function for sending JWT token
  });
  

// Update Preferences
exports.updatePreferences = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { languagePreference, notificationPreference } = req.body;
  
    // Validate languagePreference if provided
    const allowedLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ar'];
    if (languagePreference && !allowedLanguages.includes(languagePreference)) {
      return res.status(400).json({ message: 'Invalid language preference.' });
    }
  
    // Validate notificationPreference if provided
    if (notificationPreference !== undefined && typeof notificationPreference !== 'boolean') {
      return res.status(400).json({ message: 'Invalid notification preference. Must be true or false.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    if (languagePreference) user.languagePreference = languagePreference;
    if (notificationPreference !== undefined) user.notificationPreference = notificationPreference;
  

    user.addActivityLog("User updated their preferences");
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully.',
      user: {
        languagePreference: user.languagePreference,
        notificationPreference: user.notificationPreference,
      },
    });
  });

// exports.getUsers = catchAsyncErrors(async (req, res, next) => {
//     const { name, email, role, status } = req.query;
//     const use = await User.findById(req.params.id);
//     if (!user) {
//         return next(
//           new ErrorHander(User does not exist with Id: ${req.params.id})
//         );
//       }
  
//     // Build the filter query dynamically based on provided filters
//     let filter = {};
  
//     if (name) {
//       filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
//     }
//     if (email) {
//       filter.email = { $regex: email, $options: 'i' }; // Case-insensitive search for email
//     }
//     if (role) {
//       filter.role = role; // Exact match for role
//     }
//     if (status) {
//       filter.status = status; // Exact match for status (active, inactive, etc.)
//     }
  
//     // Fetch users based on the filters
//     const users = await User.find(filter);
  
//     // If no users found, return a message
//     if (users.length === 0) {
//       return next(new ErrorHander('No users found with the provided filters', 404));
//     }
  
//     // Return the filtered users
//     res.status(200).json({
//       success: true,
//       users,
//     });
//   });
  
// Get all users (admin) with optional filtering
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, role, status } = req.query;

    // Build a dynamic filter object
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive partial match
    if (email) filter.email = { $regex: email, $options: 'i' }; // Case-insensitive partial match
    if (role) filter.role = role; // Exact match for role
    if (status) filter.status = status; // Exact match for status

    // Fetch users with or without filters
    const users = await User.find(filter);

    res.status(200).json({
        success: true,
        users: users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            registrationDate: user.registrationDate,
            activityLogs: user.activityLogs,
        })),
    });
});

// -------------------------- Update User Details (Admin Only) --------------------------
exports.updateUserDetails = catchAsyncErrors(async (req, res, next) => {
    const { role, status, name, email, phone } = req.body;

    // Validate role if provided
    const validRoles = ["Admin", "Moderator", "user"];
    if (role && !validRoles.includes(role)) {
        return next(new ErrorHander("Invalid role", 400));
    }

    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Update fields if provided in the request body
    if (role) user.role = role;
    if (status) user.status = status;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Save the updated user
    await user.save();

    res.status(200).json({
        success: true,
        message: "User details updated successfully!",
        user,
    });
});

// -------------------------- Delete User (Admin Only) --------------------------
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully!",
    });
});