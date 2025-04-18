const express = require("express");
const router = express.Router();
const { markAsRead } = require("../controllers/messageController"); // Import the controller

// Route to mark the message as read
router.put("/messages/:messageId/read", markAsRead);

module.exports = router;
