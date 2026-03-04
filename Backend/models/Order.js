const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'ONLINE'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'], default: 'Placed' },
  deliveryAddress: { type: String, default: 'Default Address' }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);