const Message = require("../models/messageModel"); // Message model
const User = require("../models/userModel"); // User model
const catchAsyncErrors = require("../middlewares/catchAsyncErrors"); // Middleware for async errors
const ErrorHandler = require("../utils/errorhandler"); // Custom error handler
const sendMail = require("../utils/sendEmail"); // Import the sendMail utility
const {io} = require("../app")
// const io = require('socket.io') // Assuming you have initialized Socket.IO on the server

exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return next(new ErrorHandler("Receiver and message content are required.", 400));
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return next(new ErrorHandler("Receiver not found.", 404));
  }

  // Create new message
  const newMessage = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    content,
    read: false,
  });

  // Emit the message to the receiver using Socket.IO
  const io = req.app.get('socketio'); // Get the Socket.IO instance
  io.to(receiverId).emit('newMessage', {
    sender: req.user.name,
    content: content,
    timestamp: new Date(),
  });

  // Handle activity logs (logging sent and received messages)
  try {
    await newMessage.addActivityLog("Message sent");
  } catch (error) {
    console.error("Failed to add activity log to the sender's message:", error);
  }

  try {
    const receiverMessage = await Message.findById(newMessage._id);
    await receiverMessage.addActivityLog("Message received");
  } catch (error) {
    console.error("Failed to add activity log to the receiver's message:", error);
  }

  // Mark message as read
  try {
    const updatedMessage = await Message.findById(newMessage._id);
    updatedMessage.read = true;
    await updatedMessage.save();
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    return next(new ErrorHandler("Failed to mark message as read.", 500));
  }

  // Send email notification
  const emailOptions = {
    email: receiver.email,
    subject: "New Message Received",
    message: `<h1>New Message from ${req.user.name}</h1><p><strong>Message:</strong> ${content}</p><p>Log in to your account to reply.</p>`,
  };

  try {
    await sendMail(emailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    return next(new ErrorHandler("Failed to send email notification.", 500));
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    data: newMessage,
  });
});

exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id; // Assuming the user is authenticated and req.user contains the user's data

  // Optional pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch all messages where the user is either the sender or receiver
  const messages = await Message.find({
    $or: [
      { sender: userId },
      { receiver: userId }
    ]
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }) // Sort by most recent first
    .populate('sender', 'name email') // Optionally populate sender info
    .populate('receiver', 'name email'); // Optionally populate receiver info

  if (!messages || messages.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No messages found.",
    });
  }

  return res.status(200).json({
    success: true,
    messages,
    page,
    limit,
  });
});
