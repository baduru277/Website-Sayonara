const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorhandler");
const Dispute = require("../../models/disputeModel");

// -------------------------- Resolve Dispute --------------------------
exports.resolveDispute = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; 
  const { status, resolution } = req.body; 

  
  if (!['resolved', 'denied'].includes(status)) {
    return next(new ErrorHandler("Invalid status for dispute resolution", 400));
  }

  
  const dispute = await Dispute.findById(id);


  if (!dispute) {
    return next(new ErrorHandler("Dispute not found", 404));
  }


  dispute.status = status;
  dispute.resolution = resolution || 'No resolution provided'; 

  
  await dispute.save();

  res.status(200).json({
    success: true,
    message: `Dispute resolved as ${status}`,
    dispute,
  });
});
