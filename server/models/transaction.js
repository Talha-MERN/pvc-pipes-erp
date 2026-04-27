const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  description: String,
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  referenceDoc: {
    model: String,
    id: mongoose.Schema.Types.ObjectId,
  },
});
module.exports = mongoose.model('Transaction', transactionSchema);