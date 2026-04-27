const mongoose = require('mongoose');
const partySchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['customer', 'supplier'] },
  balance: { type: Number, default: 0 }, // positive = debit (customer owes us)
  contact: String,
});
module.exports = mongoose.model('Party', partySchema);