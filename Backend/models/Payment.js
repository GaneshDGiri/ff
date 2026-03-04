const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  gatewayTransactionId: { type: String },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ['Success', 'Failed', 'Pending'], required: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Payment', paymentSchema);