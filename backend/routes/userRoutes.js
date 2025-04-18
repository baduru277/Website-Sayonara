const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePreferences,
  getAllUser,
  getUsers,
  updateUserRole,
  updateUserDetails,
  deleteUser,
  googleLogin
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middlewares/auth");
const { apiLimiter, authLimiter } = require("../middlewares/rateLimiter");
const multer = require('multer');
const path = require('path');
const upload = require("../utils/multer");
// Import validation functions
const { validateRegister,validateLogin, validateForgotPassword, validateResetPassword } = require("../middlewares/validators/userValidators");
const { handleValidationErrors } = require("../middlewares/validators/validationHandler");
const { authorizeRoles } = require("../middlewares/auth");
// const { validationResult } = require("express-validator");

const router = express.Router();
router.post(
  "/signup",
  upload.fields([{ name: "idDocument", maxCount: 1 }, { name: "bankStatement", maxCount: 1 }]),
  registerUser
);
// router.route("/google").post(googleLogin)
router.route("/login").post( validateLogin, handleValidationErrors, loginUser);
router.route("/password/forgot").post(validateForgotPassword, handleValidationErrors, forgotPassword);
router.route("/password/reset/:token").put(validateResetPassword, handleValidationErrors, resetPassword);
router.route("/users").get(isAuthenticatedUser, apiLimiter, getAllUser); // List all users
router.route("/users/:id").put(isAuthenticatedUser,apiLimiter, updateUserDetails) // Update user role
router.route("/users/:id").delete(isAuthenticatedUser, apiLimiter, deleteUser); // Delete user
// router.route("/user/:id").get(isAuthenticatedUser, apiLimiter, getUsers)
// Update user preferences
router.route('/preferences/:id').put(updatePreferences);
module.exports = router;