const mongoose = require('mongoose');
const stockMovementSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['IN', 'OUT'] },
  reference: String, // e.g., 'Invoice INV-001'
  itemType: { type: String, enum: ['Product', 'RawMaterial'] },
  item: { type: mongoose.Schema.Types.ObjectId, refPath: 'itemType' },
  quantity: Number,
  rate: Number,
});
module.exports = mongoose.model('StockMovement', stockMovementSchema);