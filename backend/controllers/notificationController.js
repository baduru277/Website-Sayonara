const Notification = require("../models/notificationModel");
const sendEmail = require('../utils/sendEmail');
const User = require('../models/userModel'); // Import the Mongoose User model
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { body, validationResult } = require('express-validator'); // Use express-validator for input validation
const isValidEmail = require('validator').isEmail; // Use validator for email validation

// Admin sends a notification to a specific user
exports.sendNotificationToUser = [
  // Input validation and sanitization
  body('userId').isMongoId().withMessage('Invalid user ID').trim(),
  body('message').notEmpty().withMessage('Message is required').trim().escape(),
  
  catchAsyncErrors(async (req, res, next) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

    const { userId, message } = req.body;

    // Fetch user information from the User model using Mongoose's findById method
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create the notification for the user
    const notification = await Notification.create({
      user: userId,
      message,
    });

    // Prepare email content
    const subject = "New Notification from Admin";
    const text = `Hello ${user.name},\n\nYou have received a new notification: ${message}`;
    const html = `<h1>Hello ${user.name},</h1><p>You have received a new notification: ${message}</p>`;

    // Validate user's email format
    if (!user.email || !isValidEmail(user.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user email address.",
      });
    }

    // Send email to the user using the sendEmail utility
    try {
      // Send email using your simplified sendEmail function
      await sendEmail({
        email: user.email,
        subject,
        message: text,
      });

      // Emit notification to the user's socket connection
      const io = req.app.get('socketio'); // Get the Socket.IO instance
      io.to(userId).emit('newNotification', {
        message: message,
        timestamp: new Date(),
      });

      // Return success response if email is sent successfully
      return res.status(201).json({
        success: true,
        message: "Notification sent successfully to the user, and email delivered",
        notification,
      });
    } catch (error) {
      console.error('Error sending email:', error);  // Log the error for debugging
      await user.addActivityLog("sending email");

      // Respond with failure message if email fails to send
      return res.status(500).json({
        success: false,
        message: "Notification sent, but failed to send email.",
        error: 'Email service error, please try again later.',
      });
    }
  })
];

// Fetch notification history for a user
exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id; // Assuming the user is authenticated and user ID is available in req.user
  
    // Fetch notifications for the user from the database
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }); // Fetch notifications sorted by latest first
  
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found for this user.",
      });
    }
  
    // Return notifications in the response
    res.status(200).json({
      success: true,
      notifications,
    });
  });



  