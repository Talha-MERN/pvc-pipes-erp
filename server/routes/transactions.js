const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Party = require('../models/party');

// GET transactions, filter by party (required for ledger)
router.get('/', async (req, res) => {
  try {
    const { party } = req.query;
    const filter = {};
    if (party) filter.party = party;
    // Return sorted by date ascending (oldest first)
    const transactions = await Transaction.find(filter).sort('date');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new transaction (e.g., payment received, payment to supplier, expense)
router.post('/', async (req, res) => {
  try {
    const { party, description, debit, credit } = req.body;
    if (!party) return res.status(400).json({ error: 'Party required' });

    const partyDoc = await Party.findById(party);
    if (!partyDoc) return res.status(404).json({ error: 'Party not found' });

    const transaction = new Transaction({
      party,
      description: description || 'Manual Entry',
      debit: debit || 0,
      credit: credit || 0,
    });

    // Update party balance: debit increases balance (customer owes more), credit decreases it
    if (partyDoc.type === 'customer') {
      // For customer: debit means they owe more, credit means payment
      partyDoc.balance += (transaction.debit - transaction.credit);
    } else if (partyDoc.type === 'supplier') {
      // For supplier: credit means we owe them more (we bought on credit), debit means we paid
      partyDoc.balance += (transaction.credit - transaction.debit);
    }
    
    await transaction.save();
    await partyDoc.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;