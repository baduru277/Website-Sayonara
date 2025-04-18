const { body, validationResult } = require('express-validator');
const ErrorHandler = require('../utils/errorhandler');

// -------------------------- Flag Product Validation --------------------------
exports.flagProductValidation = [
  body('flagReason')
    .trim()
    .notEmpty()
    .withMessage('Flag reason is required.')
    .isLength({ min: 3 })
    .withMessage('Flag reason must be at least 3 characters long.'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 400));
    }
    next();
  }
];

// -------------------------- Resolve Flag Validation --------------------------
exports.resolveFlagValidation = [
  body('resolution')
    .trim()
    .notEmpty()
    .withMessage('Resolution is required.')
    .isIn(['approve', 'reject'])
    .withMessage('Resolution must be either "approve" or "reject".'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 400));
    }
    next();
  }
];
