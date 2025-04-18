const BroadcastMessage = require("../broadcastMessage/broadcastMessageModel");
const User = require("../../models/userModel");
const Notification = require("../../models/notificationModel");
const sendEmail = require("../../utils/sendEmail");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorhandler");
const { body, validationResult } = require("express-validator");

// Validation middleware
const validateBroadcastContent = [
  body("content")
    .notEmpty().withMessage("Content is required for the announcement.")
    .isLength({ max: 1000 }).withMessage("Content should not exceed 1000 characters.")
];

exports.sendBroadcastMessage = [
  // Validate input content
  validateBroadcastContent,

  catchAsyncErrors(async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler("Validation failed", 400, errors.array()));
    }

    const { content } = req.body;

    // Ensure the user is an admin
    if (!req.user || req.user.role !== "Admin") {
      return next(new ErrorHandler("You are not authorized to send broadcasts.", 403));
    }

    // Create the broadcast message in the database
    const broadcastMessage = await BroadcastMessage.create({
      sender: req.user.id,
      content,
    });

    // Get all users
    const users = await User.find();

    // Create a notification for each user
    for (const user of users) {
      await Notification.create({
        user: user._id,
        message: content,
      });
    }

    // Optionally send email to all users
    const emailSubject = "Admin Announcement";
    const emailText = `Hello, you have received a new broadcast message from the admin: ${content}`;

    for (const user of users) {
      if (user.email) {
        const emailOptions = {
          email: user.email,
          subject: emailSubject,
          message: emailText,
        };

        try {
          await sendEmail(emailOptions);
        } catch (error) {
          console.error("Error sending email to user:", user.email, error);
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: "Broadcast message sent to all users.",
      data: broadcastMessage,
    });
  }),
];
