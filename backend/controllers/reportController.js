const Report = require('../models/Report');
const UserActivity = require('../models/userModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
exports.getUserActivityReport = catchAsyncErrors(async (req, res, next) => {
    const userActivity = await UserActivity.aggregate([
      {
        $group: {
          _id: {
            action: '$status',          // Group by action
            userId: '$userId',          // Optionally, include userId if you want per-user activity
          },
          count: { $sum: 1 },             // Count the number of activities for each action/user pair
          latestActivity: { $max: '$timestamp' }, // Get the latest activity timestamp
        },
      },
      {
        $sort: { latestActivity: -1 }, // Sort by the latest activity timestamp in descending order
      }
    ]);
  
    res.status(200).json({
      success: true,
      reportType: 'UserActivity',
      data: userActivity,
    });
  });
  


// Get Revenue Report
exports.getRevenueReport = async (req, res) => {
  try {
    const report = await Report.findOne({ reportType: 'transaction-stats' }).sort({ generatedAt: -1 });
    if (!report) {
      return res.status(404).json({ message: 'Revenue Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue report', error });
  }
};

// Get Flagged Content Report
exports.getFlaggedContentReport = async (req, res) => {
  try {
    const report = await Report.findOne({ reportType: 'flagged-content' }).sort({ generatedAt: -1 });
    if (!report) {
      return res.status(404).json({ message: 'Flagged Content Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flagged content report', error });
  }
};

const Transaction = require('../models/transactionModel');
// const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.getTransactionStats = catchAsyncErrors(async (req, res, next) => {
  const transactionStats = await Transaction.aggregate([
    {
      $group: {
        _id: '$transactionType', // Group by transaction type (e.g., "Purchase", "Refund")
        totalAmount: { $sum: '$amount' }, // Sum up the transaction amounts
        count: { $sum: 1 }, // Count total transactions
      },
    },
  ]);

  res.status(200).json({
    success: true,
    reportType: 'TransactionStats',
    data: transactionStats,
  });
});

