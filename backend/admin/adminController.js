const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Admin Register with MFA Setup
exports.adminRegister = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;

  // Validate if the role is valid
  const validRoles = ["Admin", "user"];
  if (!validRoles.includes(role)) {
    return next(new ErrorHander("Invalid role", 400));
  }

  // Check if the user already exists with the same email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHander("User with this email already exists", 400));
  }

  // Generate MFA secret for the admin
  const secret = speakeasy.generateSecret({
    name: email, // Use email as the unique name for the user
    length: 20,
  });

  // Create new admin user with MFA secret
  const user = await User.create({
    name,
    email,
    phone,
    password,
    confirmPassword,
    role,
    mfaSecret: secret.base32,
  });

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  // Send the QR code URL to the admin for scanning
  res.status(201).json({
    success: true,
    message: 'Admin user created successfully. Scan the QR code with your authenticator app for MFA setup.',
    qrCodeUrl,
  });
});


// Admin Login with MFA Verification
exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password, mfaToken } = req.body;

  // Check if email, password, and mfaToken are provided
  if (!email || !password || !mfaToken) {
    return next(new ErrorHander("Please enter email, password, and MFA token", 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password +mfaSecret");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  // Check if password matches
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  // Verify MFA token if the user has MFA enabled
  const isMfaValid = speakeasy.totp.verify({
    secret: user.mfaSecret, 
    encoding: 'base32',
    token: mfaToken,
  });

  if (!isMfaValid) {
    return next(new ErrorHander("Invalid MFA token", 401));
  }

  sendToken(user, 200, res);
});

// -------------------------- Bulk Update Roles --------------------------
exports.bulkUpdateRoles = catchAsyncErrors(async (req, res, next) => {
    const { userIds, role } = req.body;
  
    // Validate userIds array
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return next(new ErrorHander("Please provide a list of user IDs", 400));
    }
  
    // Validate role
    const validRoles = ["Admin", "Moderator", "user"];
    if (!validRoles.includes(role)) {
      return next(new ErrorHander("Invalid role", 400));
    }
  
    // Fetch users by IDs
    const users = await User.find({ _id: { $in: userIds } });
  
    if (users.length === 0) {
      return next(new ErrorHander("No users found with the provided IDs", 404));
    }
  

    const usersToUpdate = users.filter(user => user.role !== role);
    const alreadyInRole = users.filter(user => user.role === role);
  
    if (usersToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All users are already assigned to the specified role.",
      });
    }
  
    const result = await User.updateMany(
      { _id: { $in: usersToUpdate.map(user => user._id) } },
      { $set: { role } }
    );
  
    res.status(200).json({
        success: true,
        message: `${
          usersToUpdate.length
        } users' roles updated successfully. ${
          alreadyInRole.length > 0
            ? `${alreadyInRole.length} users were already assigned the specified role.`
            : "All users required role updates."
        }`,
        alreadyInRole: alreadyInRole.length > 0 ? alreadyInRole.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
        })) : [],
      });
      
  });
  
  
// -------------------------- Bulk Ban or Activate Users --------------------------
exports.bulkBanUsers = catchAsyncErrors(async (req, res, next) => {
    const { userIds, status } = req.body;
  

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return next(new ErrorHandler("Please provide a list of user IDs", 400));
    }

    if (!["active", "banned", "suspended"].includes(status)) {
      return next(new ErrorHandler("Invalid status", 400));
    }
  
    // Fetch users by their IDs
    const users = await User.find({ _id: { $in: userIds } });
  
    // Check if any users were found
    if (!users.length) {
      return next(new ErrorHandler("No users found with the provided IDs", 404));
    }
  
    // Log the bulk action (optional)
    const adminUser = await User.findById(req.user.id);
    await adminUser.addActivityLog(`Bulk updated ${userIds.length} users' statuses to ${status}`);
  
    const usersToUpdate = users.filter(user => user.status !== status);
    const alreadyInStatus = users.filter(user => user.status === status);
  
    if (usersToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All users are already assigned to the specified status.",
      });
    }
  
    // Update statuses for users that require changes
    const result = await User.updateMany(
      { _id: { $in: usersToUpdate.map(user => user._id) } },
      { $set: { status } }
    );
  
    // Format the success message with the correct number of modified users
    res.status(200).json({
      success: true,
      message: `${
        usersToUpdate.length
      } users' status updated successfully. ${
        alreadyInStatus.length > 0
          ? `${alreadyInStatus.length} users were already assigned the specified status.`
          : "All users required status updates."
      }`,
      alreadyInStatus: alreadyInStatus.length > 0
        ? alreadyInStatus.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
          }))
        : [],
    });
  });
  
  


// Example: After updating user details
exports.updateUserDetails = catchAsyncErrors(async (req, res, next) => {
    const { role, status, name, email, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Update fields if provided in the request body
    let updatedFields = [];
    if (role) {
        user.role = role;
        updatedFields.push(`Role: ${role}`);
    }
    if (status) {
        user.status = status;
        updatedFields.push(`Status: ${status}`);
    }
    if (name) {
        user.name = name;
        updatedFields.push(`Name: ${name}`);
    }
    if (email) {
        user.email = email;
        updatedFields.push(`Email: ${email}`);
    }
    if (phone) {
        user.phone = phone;
        updatedFields.push(`Phone: ${phone}`);
    }

    // Add the activity log
    await user.addActivityLog(`User updated: ${updatedFields.join(", ")}`);

    await user.save();

    res.status(200).json({
        success: true,
        message: "User details updated successfully!",
        user,
    });
});


  