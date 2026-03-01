const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createCheckoutSession,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  stripeWebhook,
  confirmPayment,
} = require('../controllers/orderController');

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.route('/').post(protect, createCheckoutSession).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getUserOrders);
router.get('/confirm', protect, confirmPayment);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
