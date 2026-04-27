import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function ProductionForm() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRMs, setSelectedRMs] = useState([{ material: '', quantity: 1 }]);
  const [selectedProducts, setSelectedProducts] = useState([{ product: '', quantity: 1 }]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/raw-materials').then(res => setRawMaterials(res.data));
    API.get('/api/products').then(res => setProducts(res.data));
  }, []);

  const addRM = () => setSelectedRMs([...selectedRMs, { material: '', quantity: 1 }]);
  const handleRMChange = (idx, field, value) => {
    const updated = [...selectedRMs];
    updated[idx][field] = value;
    setSelectedRMs(updated);
  };

  const addProduct = () => setSelectedProducts([...selectedProducts, { product: '', quantity: 1 }]);
  const handleProductChange = (idx, field, value) => {
    const updated = [...selectedProducts];
    updated[idx][field] = value;
    setSelectedProducts(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        rawMaterials: selectedRMs.map(rm => ({ material: rm.material, quantity: Number(rm.quantity) })),
        products: selectedProducts.map(p => ({ product: p.product, quantity: Number(p.quantity) }))
      };
      await API.post('/api/production', payload);
      alert('Production recorded successfully');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Production entry failed');
    }
  };

  return (
    <div>
      <h2>Record Production</h2>
      <form onSubmit={handleSubmit}>
        <h3>Raw Materials Consumed</h3>
        {selectedRMs.map((rm, idx) => (
          <div key={idx} style={{ marginBottom: '5px' }}>
            <select value={rm.material} onChange={e => handleRMChange(idx, 'material', e.target.value)} required>
              <option value="">Select Raw Material</option>
              {rawMaterials.map(m => <option key={m._id} value={m._id}>{m.name} (Stock: {m.stock})</option>)}
            </select>
            <input type="number" min="0.1" step="0.1" value={rm.quantity} onChange={e => handleRMChange(idx, 'quantity', e.target.value)} required />
          </div>
        ))}
        <button type="button" onClick={addRM}>+ Add Material</button>

        <h3>Products Produced</h3>
        {selectedProducts.map((p, idx) => (
          <div key={idx} style={{ marginBottom: '5px' }}>
            <select value={p.product} onChange={e => handleProductChange(idx, 'product', e.target.value)} required>
              <option value="">Select Product</option>
              {products.map(prod => <option key={prod._id} value={prod._id}>{prod.name}</option>)}
            </select>
            <input type="number" min="1" value={p.quantity} onChange={e => handleProductChange(idx, 'quantity', e.target.value)} required />
          </div>
        ))}
        <button type="button" onClick={addProduct}>+ Add Product</button>
        <br/><br/>
        <button type="submit">Submit Production</button>
      </form>
    </div>
  );
}

export default ProductionForm;