const express = require('express');
const router = express.Router();
const RawMaterial = require('../models/rawMaterial');

// GET all raw materials
router.get('/', async (req, res) => {
  try {
    const materials = await RawMaterial.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single raw material
router.get('/:id', async (req, res) => {
  try {
    const mat = await RawMaterial.findById(req.params.id);
    if (!mat) return res.status(404).json({ error: 'Raw material not found' });
    res.json(mat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create raw material
router.post('/', async (req, res) => {
  try {
    const mat = new RawMaterial(req.body);
    await mat.save();
    res.status(201).json(mat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update raw material
router.put('/:id', async (req, res) => {
  try {
    const mat = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mat) return res.status(404).json({ error: 'Raw material not found' });
    res.json(mat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE raw material
router.delete('/:id', async (req, res) => {
  try {
    const mat = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!mat) return res.status(404).json({ error: 'Raw material not found' });
    res.json({ message: 'Raw material deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;