// adminRoutes.js
const express = require("express");//
const router = express.Router();
const { bulkUpdateRoles, bulkBanUsers, adminLogin, adminRegister } = require("../admin/adminController");
// const { isAdmin } = require("../middleware/auth"); // Assuming you have an isAdmin middleware for authorization
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const { authLimiter, apiLimiter, loginLimiter } = require("../middlewares/rateLimiter");

// Admin Login route
router.route("/admin/register").post(authLimiter , apiLimiter , adminRegister)
router.route("/admin/login").post(loginLimiter,apiLimiter, adminLogin);



// Bulk Update Roles route (PUT request)
router.put("/admin/bulk-update-roles", isAuthenticatedUser, authorizeRoles("Admin"),bulkUpdateRoles);
router.put("/admin/bulk-ban-users", isAuthenticatedUser,authorizeRoles("Admin"), bulkBanUsers);
module.exports = router;
