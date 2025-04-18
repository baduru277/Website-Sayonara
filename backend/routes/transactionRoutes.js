const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const {
  getTransactions,
  updateTransactionStatus,
  addDispute,
  resolveDispute,
  createTransaction,
  approveDispute,
  denyDispute
} = require('../controllers/transations/transactionController');

const router = express.Router();

router.route("/createtransactions").post(isAuthenticatedUser,createTransaction)

// Get all transactions (Authenticated User)
router.route('/transactions').get(isAuthenticatedUser,authorizeRoles("Admin"),getTransactions);

// Update transaction status (Admin only)
router.route('/transactions/:id').put(isAuthenticatedUser, authorizeRoles('Admin'), updateTransactionStatus);

// Add a dispute to a transaction (Authenticated User)
router.route('/transactions/:id/dispute').post(isAuthenticatedUser,  authorizeRoles('Admin'),addDispute);

// Resolve dispute by Admin
router.route('/dispute/:id/resolve').put(isAuthenticatedUser, authorizeRoles('Admin'), resolveDispute);

router.route('/dispute/:id/approve').put(isAuthenticatedUser, authorizeRoles("Admin"),approveDispute);

// Route to deny a dispute
router.route('/dispute/:id/deny').put(isAuthenticatedUser, authorizeRoles("Admin"),denyDispute);

module.exports = router;
