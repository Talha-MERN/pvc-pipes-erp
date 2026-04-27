import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RawMaterialList() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ name: '', unit: 'kg', reorderLevel: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchData = () => axios.get('/api/raw-materials').then(res => setMaterials(res.data));
  useEffect(() => { fetchData(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => {
    setForm({ name: '', unit: 'kg', reorderLevel: '' });
    setEditingId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, reorderLevel: Number(form.reorderLevel), stock: Number(form.stock) };
    try {
      if (editingId) {
        await axios.put(`/api/raw-materials/${editingId}`, payload);
      } else {
        await axios.post('/api/raw-materials', payload);
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving material');
    }
  };

  const handleEdit = mat => {
    setEditingId(mat._id);
    setForm({ name: mat.name, unit: mat.unit, reorderLevel: mat.reorderLevel || 0, stock: mat.stock });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this material?')) {
      await axios.delete(`/api/raw-materials/${id}`);
      fetchData();
    }
  };

  return (
    <div>
      <h2>Raw Materials</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f7f7f7', padding: '15px' }}>
        <h3>{editingId ? 'Edit Raw Material' : 'Add Raw Material'}</h3>
        <input name="name" placeholder="Name (e.g. PVC Resin)" value={form.name} onChange={handleChange} required />&nbsp;
        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="kg">Kg</option>
          <option value="bag">Bag</option>
          <option value="liter">Liter</option>
        </select>&nbsp;
        <input name="reorderLevel" type="number" placeholder="Reorder Level" value={form.reorderLevel} onChange={handleChange} />&nbsp;
        <input name="stock" type="number" placeholder="Stock Quantity" value={form.stock} onChange={handleChange} />&nbsp;
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr><th>Name</th><th>Unit</th><th>Stock</th><th>Reorder Level</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {materials.map(m => (
            <tr key={m._id} style={{ background: m.stock <= m.reorderLevel ? '#ffeeba' : 'transparent' }}>
              <td>{m.name}</td>
              <td>{m.unit}</td>
              <td>{m.stock}</td>
              <td>{m.reorderLevel}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Edit</button>
                <button onClick={() => handleDelete(m._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RawMaterialList;