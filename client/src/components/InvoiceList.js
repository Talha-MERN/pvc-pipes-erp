import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    API.get('/api/invoices').then(res => setInvoices(res.data)).catch(console.error);
  }, []);

  if (!invoices.length) return <div>No invoices yet. <Link to="/invoices/new">Create one</Link></div>;

  return (
    <div>
      <h2>Invoices</h2>
      <Link to="/invoices/new">+ New Invoice</Link>
      <table border="1" cellPadding="5" style={{ marginTop: '10px', width: '100%' }}>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv._id}>
              <td>{inv.invoiceNumber}</td>
              <td>{new Date(inv.date).toLocaleDateString()}</td>
              <td>{inv.customer?.name || 'Unknown'}</td>
              <td>{inv.totalAmount}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;