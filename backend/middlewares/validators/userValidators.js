const { body, param } = require("express-validator");

// Validate user registration
const validateRegister = [
  body("name").isString().withMessage("Name must be a string").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validate user login
const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validate forgot password
const validateForgotPassword = [
  body("email").isEmail().withMessage("Please enter a valid email"),
];

// Validate password reset
const validateResetPassword = [
  param("token").notEmpty().withMessage("Token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validate OTP verification
const validateVerifyOtp = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("otp").isNumeric().withMessage("OTP must be numeric").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
];

// Validate OTP resend
const validateResendOtp = [
  body("email").isEmail().withMessage("Please enter a valid email"),
];

// Validate email check
const validateCheckEmail = [
  body("email").isEmail().withMessage("Please enter a valid email"),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyOtp,
  validateResendOtp,
  validateCheckEmail,
};
