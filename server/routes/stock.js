const express = require('express');
const router = express.Router();
const StockMovement = require('../models/stockMovement');
const Product = require('../models/product');
const RawMaterial = require('../models/rawMaterial');

// GET stock movements, optional filters
router.get('/movements', async (req, res) => {
  try {
    const { itemType, item } = req.query;
    const filter = {};
    if (itemType) filter.itemType = itemType;
    if (item) filter.item = item;
    const movements = await StockMovement.find(filter)
      .populate('item')
      .sort('-date');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET stock summary (current stock levels)
router.get('/summary', async (req, res) => {
  try {
    const products = await Product.find({}, 'name stock reorderLevel');
    const rawMaterials = await RawMaterial.find({}, 'name stock reorderLevel');

    // Identify low-stock items
    const lowStockProducts = products.filter(p => p.stock <= (p.reorderLevel || 0));
    const lowStockMaterials = rawMaterials.filter(m => m.stock <= (m.reorderLevel || 0));

    res.json({
      products,
      rawMaterials,
      lowStockProducts,
      lowStockMaterials,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;