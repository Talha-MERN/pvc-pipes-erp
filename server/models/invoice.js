const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  date: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    description: String,
    quantity: Number,
    rate: Number,
    total: Number,
  }],
  totalAmount: Number,
  status: String, // 'pending','paid','cancelled'
});
module.exports = mongoose.model('Invoice', invoiceSchema);