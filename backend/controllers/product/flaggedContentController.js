const FlaggedContent = require('../../models/FlaggedContentModel');
const Product = require('../../models/productModel');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const ErrorHandler = require('../../utils/errorhandler');

// -------------------------- Flag Product --------------------------
exports.flagProduct = catchAsyncErrors(async (req, res, next) => {
  const { flagReason } = req.body;

  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const flaggedContent = await FlaggedContent.create({
    product: req.params.productId,
    user: req.user._id,
    flagReason,
  });

  res.status(201).json({
    success: true,
    message: 'Product has been flagged for moderation.',
    flaggedContent,
  });
});

// -------------------------- Get Flagged Products --------------------------
exports.getFlaggedProducts = catchAsyncErrors(async (req, res, next) => {
  const flaggedProducts = await FlaggedContent.find()
    .populate('product')
    .populate('user')
    .populate('moderator');

  res.status(200).json({
    success: true,
    flaggedProducts,
  });
});

// -------------------------- Resolve Flag --------------------------
exports.resolveFlag = catchAsyncErrors(async (req, res, next) => {
  const { resolution } = req.body;

  let flaggedContent = await FlaggedContent.findById(req.params.flaggedId);

  if (!flaggedContent) {
    return next(new ErrorHandler('Flagged content not found', 404));
  }

  flaggedContent.status = 'resolved';
  flaggedContent.resolution = resolution;
  flaggedContent.moderator = req.user._id;

  flaggedContent = await flaggedContent.save();

  // Update the product status based on resolution
  const product = await Product.findById(flaggedContent.product);
  if (resolution === 'approve') {
    product.status = 'active';
  } else if (resolution === 'reject') {
    product.status = 'inactive';
  }
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Flag has been resolved.',
    flaggedContent,
  });
});
