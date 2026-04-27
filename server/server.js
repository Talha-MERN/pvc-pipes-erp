require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/products');
const rawMaterialRoutes = require('./routes/rawMaterials');
const partyRoutes = require('./routes/parties');
const invoiceRoutes = require('./routes/invoices');
const transactionRoutes = require('./routes/transactions');
const stockRoutes = require('./routes/stock');
const productionRoutes = require('./routes/production');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/products', productRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/production', productionRoutes);

app.listen(port, () => console.log('Server running on port 5000'));