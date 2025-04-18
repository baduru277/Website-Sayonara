const express = require('express');
const router = express.Router();
const { flagProduct, getFlaggedProducts, resolveFlag } = require('../../controllers/product/flaggedContentController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth');

// Flag a Product
router.post('/:productId/flag', isAuthenticatedUser, authorizeRoles("Admin"),flagProduct);

// Get Flagged Products
router.get('/flagged', isAuthenticatedUser,authorizeRoles("Admin"),getFlaggedProducts);

// Resolve Flag
router.put('/flag/:flaggedId/resolve', isAuthenticatedUser,resolveFlag);

module.exports = router;
