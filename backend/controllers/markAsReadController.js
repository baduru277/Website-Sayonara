const Message = require("../models/messageModel"); 
const catchAsyncErrors = require("../middlewares/catchAsyncErrors"); 
const ErrorHandler = require("../utils/errorhandler"); 

exports.markAsRead = catchAsyncErrors(async (req, res, next) => {
  const { messageId } = req.params; 

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new ErrorHandler("Message not found.", 404));
  }

  if (message.read) {
    return res.status(200).json({
      success: true,
      message: "Message is already marked as read.",
    });
  }

  message.read = true;
  
  try {
    await message.addActivityLog("Message read");
    console.log("Activity log added to the message successfully.");
  } catch (error) {
    console.error("Failed to add activity log:", error);
  }

  await message.save();

  res.status(200).json({
    success: true,
    message: "Message marked as read.",
    data: message,
  });
});
