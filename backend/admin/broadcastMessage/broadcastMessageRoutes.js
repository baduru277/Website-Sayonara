const express = require('express');
const { sendBroadcastMessage } = require('../broadcastMessage/broadcastMessageController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth'); // Assuming you have an authentication middleware

const router = express.Router();

// Route to send broadcast message
router.route('/broadcast').post(isAuthenticatedUser, authorizeRoles("Admin"),sendBroadcastMessage);

module.exports = router;
