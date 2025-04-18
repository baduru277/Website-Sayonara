const express = require("express");
const router = express.Router();
const { sendMessage, getAllMessages } = require("../controllers/messageController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/messages").post(isAuthenticatedUser, sendMessage);
router.route('/messages').get(isAuthenticatedUser, getAllMessages);

module.exports = router;
