const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Invoice = require('../models/invoice');
const Product = require('../models/product');
const StockMovement = require('../models/stockMovement');
const Transaction = require('../models/transaction');
const Party = require('../models/party');

// Create invoice (with stock decrement and customer ledger debit)
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { customer, items } = req.body;
    // calculate total and validate stock
    let totalAmount = 0;
    const invoiceItems = [];
    for (let it of items) {
      const product = await Product.findById(it.product).session(session);
      if (!product) throw new Error(`Product ${it.product} not found`);
      if (product.stock < it.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      const rate = it.rate || product.sellingPrice;
      const total = rate * it.quantity;
      totalAmount += total;
      invoiceItems.push({ product: product._id, description: product.name, quantity: it.quantity, rate, total });

      // Decrement stock
      product.stock -= it.quantity;
      await product.save({ session });

      // Log stock movement
      await StockMovement.create([{
        date: new Date(),
        type: 'OUT',
        reference: 'Pending Invoice',
        itemType: 'Product',
        item: product._id,
        quantity: it.quantity,
        rate,
      }], { session });
    }

    // Invoice number (simple count-based)
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(3, '0')}`;

    const invoice = await Invoice.create([{
      invoiceNumber,
      customer,
      items: invoiceItems,
      totalAmount,
      status: 'pending',
    }], { session });

    // Customer ledger debit (increases balance)
    const customerDoc = await Party.findById(customer).session(session);
    await Transaction.create([{
      party: customer,
      description: `Invoice ${invoiceNumber}`,
      debit: totalAmount,
      credit: 0,
      referenceDoc: { model: 'Invoice', id: invoice[0]._id },
    }], { session });
    customerDoc.balance += totalAmount; // positive balance = they owe
    await customerDoc.save({ session });

    await session.commitTransaction();
    res.status(201).json(invoice[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

// GET all invoices
router.get('/', async (req, res) => {
  const invoices = await Invoice.find().populate('customer items.product');
  res.json(invoices);
});

module.exports = router;