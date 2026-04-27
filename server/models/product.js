const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  sku: String,
  name: String,
  size: String,
  length: Number,
  unit: { type: String, default: 'piece' },
  sellingPrice: Number,
  stock: { type: Number, default: 0 },
  reorderLevel: Number,
});
module.exports = mongoose.model('Product', productSchema);