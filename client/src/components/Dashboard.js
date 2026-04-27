import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    API.get('/api/stock/summary').then(res => setSummary(res.data)).catch(console.error);
  }, []);

  if (!summary) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 style={{ textDecoration: 'underline' }}>Dashboard</h2>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
        <div>
          <h3>Products ({summary.products.length})</h3>
          <p>Low stock: {summary.lowStockProducts.length}</p>
        </div>
        <div>
          <h3>Raw Materials ({summary.rawMaterials.length})</h3>
          <p>Low stock: {summary.lowStockMaterials.length}</p>
        </div>
      </div>

      {summary.lowStockProducts.length > 0 && (
        <div style={{ background: '#fff3cd', padding: '10px', marginBottom: '10px' }}>
          <strong>⚠️ Low Stock Products:</strong>
          <ul>
            {summary.lowStockProducts.map(p => (
              <li key={p._id}>{p.name} – {p.stock} left (reorder at {p.reorderLevel})</li>
            ))}
          </ul>
        </div>
      )}

      {summary.lowStockMaterials.length > 0 && (
        <div style={{ background: '#fff3cd', padding: '10px' }}>
          <strong>⚠️ Low Raw Materials:</strong>
          <ul>
            {summary.lowStockMaterials.map(m => (
              <li key={m._id}>{m.name} – {m.stock} left (reorder at {m.reorderLevel})</li>
            ))}
          </ul>
        </div>
      )}

      {summary.lowStockProducts.length === 0 && summary.lowStockMaterials.length === 0 && (
        <p>All stock levels are healthy...</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/invoices/new">Create New Invoice</Link> | <Link to="/production">Record Production</Link>
      </div>
    </div>
  );
}

export default Dashboard;