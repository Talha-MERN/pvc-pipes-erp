import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import RawMaterialList from './components/RawMaterialList';
import PartyList from './components/PartyList';
import InvoiceList from './components/InvoiceList';
import CreateInvoice from './components/CreateInvoice';
import Ledger from './components/Ledger';
import ProductionForm from './components/ProductionForm';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: '#eee', padding: '10px' }}>
        <Link to="/">Dashboard</Link> | <Link to="/products">Products</Link> | <Link to="/raw-materials">Raw Materials</Link> | <Link to="/parties">Parties</Link> | <Link to="/invoices">Invoices</Link> | <Link to="/ledger">Ledger</Link> | <Link to="/production">Production</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/raw-materials" element={<RawMaterialList />} />
        <Route path="/parties" element={<PartyList />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/production" element={<ProductionForm />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;