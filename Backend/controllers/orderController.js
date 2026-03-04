const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { items, paymentMethod, deliveryAddress, totalAmount } = req.body;
        const order = await Order.create({
            user: req.user.id,
            items,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed'
        });
        res.status(201).json({ orderId: order._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
};