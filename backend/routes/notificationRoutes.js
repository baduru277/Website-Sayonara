const express = require("express");
const router = express.Router();
const { sendNotification, getNotifications, sendNotificationToUser, sendMessageWithNotification, getAllNotifications } = require("../controllers/notificationController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/notifications/:id").post(isAuthenticatedUser, authorizeRoles("Admin"),sendNotificationToUser);
router.route("/notifications").get(isAuthenticatedUser,authorizeRoles("Admin"),getNotifications);


module.exports = router;
