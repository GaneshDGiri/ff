const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');
const adminController = require('../controllers/adminController');

const upload = multer({ dest: 'uploads/' });

// Auth
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);

// Products
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', protect, admin, upload.single('image'), productController.createProduct);
router.delete('/products/:id', protect, admin, productController.deleteProduct);

// Orders & Payment
router.post('/orders', protect, orderController.createOrder);
router.get('/orders/myorders', protect, orderController.getUserOrders);
router.post('/payment/create-order', protect, paymentController.createPaymentOrder);
router.post('/payment/verify', protect, paymentController.verifyPayment);

// Admin Stats
router.get('/admin/stats', protect, admin, adminController.getAdminStats);
router.put('/admin/update-status', protect, admin, adminController.updateOrderStatus);

module.exports = router;