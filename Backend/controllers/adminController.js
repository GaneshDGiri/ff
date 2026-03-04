const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Fetch all stats for the owner dashboard
exports.getAdminStats = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone role createdAt')
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });

    const customers = await User.find().select('-password').sort({ createdAt: -1 });

    const completedOrders = await Order.find({ paymentStatus: 'Completed' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({ orders, customers, totalRevenue });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
};

// Update the status of a specific order
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { orderStatus: status });
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};