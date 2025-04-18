const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth');
const { createProduct, getAllProducts, approveProduct, rejectProduct } = require('../../controllers/product/productController');

const router = express.Router();

router.route('/products').get(isAuthenticatedUser, getAllProducts);
router.route('/products/new').post(isAuthenticatedUser,authorizeRoles("Admin"), createProduct);
// Approve Product
router.route('/product/:id/approve').put(isAuthenticatedUser,authorizeRoles("Admin"),approveProduct);
// Reject Product
router.route('/product/:id/reject').put(isAuthenticatedUser,authorizeRoles("Admin"),rejectProduct);

module.exports = router;
