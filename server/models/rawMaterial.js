const mongoose = require('mongoose');
const rawMaterialSchema = new mongoose.Schema({
  name: String,
  unit: { type: String, default: 'kg' },
  stock: { type: Number, default: 0 },
  reorderLevel: Number,
});
module.exports = mongoose.model('RawMaterial', rawMaterialSchema);