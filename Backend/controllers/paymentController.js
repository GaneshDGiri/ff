const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

exports.createPaymentOrder = async (req, res) => {
  const { amount } = req.body;

  // Uses owner payment details from .env
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Razorpay Error" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId, amount } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Update order and payment history in MongoDB
    await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'Completed' });
    await Payment.create({
      orderId: dbOrderId,
      gatewayTransactionId: razorpay_payment_id,
      amount,
      method: 'ONLINE',
      status: 'Success'
    });
    res.status(200).json({ message: "Success" });
  } else {
    res.status(400).json({ error: "Invalid Signature" });
  }
};