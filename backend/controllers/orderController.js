const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createOrder = asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    address,
    status: 'pending',
  });
  res.status(201).json(order);
});

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, address } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    address,
    status: 'pending',
  });

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: { orderId: order._id.toString() },
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.json({ url: session.url, orderId: order._id });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.food', 'name image')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('items.food', 'name image')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status || order.status;
  const updated = await order.save();
  res.json(updated);
});

const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findOne({ stripeSessionId: session.id });
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.stripePaymentId = session.payment_intent;
      order.status = 'confirmed';
      await order.save();
    }
  }
  res.json({ received: true });
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { session_id, order_id } = req.query;
  const order = await Order.findById(order_id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (session_id && !order.isPaid) {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.stripePaymentId = session.payment_intent;
      order.status = 'confirmed';
      await order.save();
    }
  }
  res.json(order);
});

module.exports = {
  createOrder,
  createCheckoutSession,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  stripeWebhook,
  confirmPayment,
};
