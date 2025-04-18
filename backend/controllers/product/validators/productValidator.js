const { body } = require('express-validator');

exports.createUpdateProductValidator = [
  // Title Validation
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  // Description Validation
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  // Price Validation
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  // Category Validation
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Books', 'Furniture', 'Toys', 'Food'])
    .withMessage('Category must be one of the following: Electronics, Clothing, Books, Furniture, Toys, Food'),

  // Images Validation (Array of strings)
  body('images')
    .isArray()
    .withMessage('Images must be an array')
    .custom((value) => {
      if (value && !value.every((image) => typeof image === 'string')) {
        throw new Error('Each image must be a string');
      }
      return true;
    }),

  // Owner Validation (must be a valid user ID, optional)
  body('owner')
    .optional()
    .isMongoId()
    .withMessage('Owner must be a valid user ID'),

  // Status Validation (draft, available, or out of stock)
  body('status')
    .optional()
    .isIn(['draft', 'available', 'out of stock'])
    .withMessage('Status must be either "draft", "available", or "out of stock"'),

  // Featured Validation (boolean)
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  // Publish Date Validation (optional but must be a valid date)
  body('publishDate')
    .optional()
    .isISO8601()
    .withMessage('Publish Date must be a valid ISO 8601 date'),

  // SEO Validation (optional fields)
  body('seo')
    .optional()
    .isObject()
    .withMessage('SEO must be an object')
    .custom((value) => {
      if (value && value.metaKeywords && !Array.isArray(value.metaKeywords)) {
        throw new Error('metaKeywords must be an array');
      }
      return true;
    }),
];
