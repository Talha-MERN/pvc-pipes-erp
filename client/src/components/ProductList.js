import React, { useState, useEffect } from 'react';
import API from '../api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: '', name: '', size: '', length: '', unit: 'piece', sellingPrice: '', reorderLevel: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = () => API.get('/api/products').then(res => setProducts(res.data));

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ sku: '', name: '', size: '', length: '', unit: 'piece', sellingPrice: '', reorderLevel: '', stock: '' });
    setEditingId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, length: Number(form.length), sellingPrice: Number(form.sellingPrice), reorderLevel: Number(form.reorderLevel), stock: Number(form.stock) };
    try {
      if (editingId) {
        await API.put(`/api/products/${editingId}`, payload);
      } else {
        await API.post('/api/products', payload);
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving product');
    }
  };

  const handleEdit = product => {
    setEditingId(product._id);
    setForm({
      sku: product.sku || '',
      name: product.name,
      size: product.size || '',
      length: product.length,
      unit: product.unit,
      sellingPrice: product.sellingPrice,
      reorderLevel: product.reorderLevel || 0,
      stock: product.stock
    });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this product?')) {
      await API.delete(`/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <h2>Products (Finished Pipes)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px' }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />&nbsp;
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />&nbsp;
        <input name="size" placeholder="Size (e.g. 4 inch)" value={form.size} onChange={handleChange} />&nbsp;
        <input name="length" type="number" step="0.1" placeholder="Length (m)" value={form.length} onChange={handleChange} />&nbsp;
        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="piece">Piece</option>
          <option value="meter">Meter</option>
          <option value="kg">Kg</option>
        </select><br/>
        <input name="sellingPrice" type="number" step="0.01" placeholder="Selling Price" value={form.sellingPrice} onChange={handleChange} required />&nbsp;
        <input name="reorderLevel" type="number" placeholder="Reorder Level" value={form.reorderLevel} onChange={handleChange} />&nbsp;
        <input name="stock" type="number" placeholder="Stock Quantity" value={form.stock} onChange={handleChange} />&nbsp;
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>SKU</th><th>Name</th><th>Size</th><th>Length</th><th>Unit</th><th>Price</th><th>Stock</th><th>Reorder</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} style={{ background: p.stock <= p.reorderLevel ? '#ffeeba' : 'transparent' }}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.size}</td>
              <td>{p.length}</td>
              <td>{p.unit}</td>
              <td>{p.sellingPrice}</td>
              <td>{p.stock}</td>
              <td>{p.reorderLevel}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;