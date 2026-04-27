const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Production = require('../models/production');
const RawMaterial = require('../models/rawMaterial');
const Product = require('../models/product');
const StockMovement = require('../models/stockMovement');

// POST a production entry
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { rawMaterials, products } = req.body; // arrays of { material, quantity } and { product, quantity }

    // 1. Validate and deduct raw materials
    for (let rm of rawMaterials) {
      const mat = await RawMaterial.findById(rm.material).session(session);
      if (!mat) throw new Error(`Raw material ${rm.material} not found`);
      if (mat.stock < rm.quantity) throw new Error(`Insufficient stock for ${mat.name}`);
      mat.stock -= rm.quantity;
      await mat.save({ session });

      await StockMovement.create([{
        date: new Date(),
        type: 'OUT',
        reference: 'Production',
        itemType: 'RawMaterial',
        item: mat._id,
        quantity: rm.quantity,
        rate: 0, // raw material cost not captured here, can be added later
      }], { session });
    }

    // 2. Add finished products
    for (let prod of products) {
      const product = await Product.findById(prod.product).session(session);
      if (!product) throw new Error(`Product ${prod.product} not found`);
      product.stock += prod.quantity;
      await product.save({ session });

      await StockMovement.create([{
        date: new Date(),
        type: 'IN',
        reference: 'Production',
        itemType: 'Product',
        item: product._id,
        quantity: prod.quantity,
        rate: 0, // production cost not calculated
      }], { session });
    }

    const productionDoc = await Production.create([{
      rawMaterials,
      products,
    }], { session });

    await session.commitTransaction();
    res.status(201).json(productionDoc[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

// GET all production entries
router.get('/', async (req, res) => {
  try {
    const productions = await Production.find()
      .populate('rawMaterials.material products.product');
    res.json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;