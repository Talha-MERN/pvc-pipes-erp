import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateInvoice() {
  const [parties, setParties] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1 }]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/parties?type=customer').then(res => setParties(res.data));
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

  const addItem = () => setItems([...items, { product: '', quantity: 1 }]);
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/invoices', { customer: selectedCustomer, items });
      alert('Invoice created!');
      navigate('/invoices');
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} required>
          <option value="">Select Customer</option>
          {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select><br/><br/>
        {items.map((it, idx) => (
          <div key={idx}>
            <select value={it.product} onChange={e => handleItemChange(idx, 'product', e.target.value)} required>
              <option value="">Select Product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} (Stock:{p.stock})</option>)}
            </select>
            <input type="number" value={it.quantity} onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value))} min="1" />
            <br/>
          </div>
        ))}
        <button type="button" onClick={addItem}>+ Add Item</button><br/><br/>
        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
}
export default CreateInvoice;