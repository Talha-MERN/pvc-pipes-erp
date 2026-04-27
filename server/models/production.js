const mongoose = require('mongoose');
const productionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  rawMaterials: [{
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial' },
    quantity: Number,
  }],
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
});
module.exports = mongoose.model('Production', productionSchema);