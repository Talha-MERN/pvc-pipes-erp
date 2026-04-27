const express = require('express');
const router = express.Router();
const Party = require('../models/party');

// GET parties, optional filter by type (e.g., ?type=customer)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const parties = await Party.find(filter);
    res.json(parties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single party (used by Ledger to get current balance)
router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create party
router.post('/', async (req, res) => {
  try {
    const party = new Party(req.body);
    await party.save();
    res.status(201).json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update party
router.put('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json(party);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE party
router.delete('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json({ message: 'Party deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;