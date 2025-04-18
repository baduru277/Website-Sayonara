const { validationResult } = require('express-validator');
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const Product = require("../../models/productModel");
const { createUpdateProductValidator } = require("../../controllers/product/validators/productValidator");
const _response_message = require("../../utils/messages");
const FlaggedContent = require('../../models/FlaggedContentModel');
const user = require("../../models/userModel")
// -------------------------- Create Product --------------------------
exports.createProduct = [
  createUpdateProductValidator, // Validation middleware
  catchAsyncErrors(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg).join(", ");
      return next(new ErrorHandler(errorMessages, 400));
    }

    const { title, description, price, category, images } = req.body;

    // Create a new product
    const product = await Product.create({
      title,
      description,
      price,
      category,
      images,
      owner: req.user._id, // assuming user ID is in the request
    });
    res.status(201).json({
      success: true,
      message: _response_message._query.add("Product"),
      product,
    });
  })
];

// -------------------------- Update Product --------------------------
exports.updateProduct = [
  createUpdateProductValidator, // Validation middleware
  catchAsyncErrors(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array(), 400));
    }

    const { title, description, price, category, images } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler(_response_message._query.notFound("Product"), 404));
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        category,
        images,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );


    res.status(200).json({
      success: true,
      message: _response_message._query.update("Product"),
      product,
    });
  })
];

// -------------------------- Get All Products --------------------------
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const products = await Product.find()
    .sort({ createdAt: -1 }) 
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await Product.countDocuments();
  
  res.status(200).json({
    success: true,
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  });
});

// -------------------------- Get Single Product --------------------------
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(_response_message._query.notFound("Product"), 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// -------------------------- Delete Product --------------------------
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(_response_message._query.notFound("Product"), 404));
  }

  await product.remove();


  res.status(200).json({
    success: true,
    message: _response_message._query.delete("Product"),
  });
});



// admin

// -------------------------- Approve Product --------------------------
exports.approveProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (product.status === 'approved') {
    return next(new ErrorHandler('Product is already approved', 400));
  }

  product.status = 'approved';
  await product.save();


  res.status(200).json({
    success: true,
    message: 'Product has been approved.',
    product,
  });
});

// -------------------------- Reject Product --------------------------
exports.rejectProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  if (product.status === 'rejected') {
    return next(new ErrorHandler('Product is already rejected', 400));
  }

  product.status = 'rejected';
  await product.save();



  res.status(200).json({
    success: true,
    message: 'Product has been rejected.',
    product,
  });
});
