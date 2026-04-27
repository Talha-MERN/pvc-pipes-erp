import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';

function PartyList() {
  const [parties, setParties] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({ name: '', type: 'customer', contact: '', balance: 0 });
  const [editingId, setEditingId] = useState(null);

  const fetchParties = useCallback(async () => {
    const query = filterType ? `?type=${filterType}` : '';
    const res = await API.get(`/api/parties${query}`);
    setParties(res.data);
  }, [filterType]);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => {
    setForm({ name: '', type: 'customer', contact: '', balance: 0 });
    setEditingId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, balance: Number(form.balance) };
    try {
      if (editingId) {
        await API.put(`/api/parties/${editingId}`, payload);
      } else {
        await API.post('/api/parties', payload);
      }
      fetchParties();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving party');
    }
  };

  const handleEdit = party => {
    setEditingId(party._id);
    setForm({ name: party.name, type: party.type, contact: party.contact || '', balance: party.balance });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this party?')) {
      await API.delete(`/api/parties/${id}`);
      fetchParties();
    }
  };

  return (
    <div>
      <h2>Parties (Customers & Suppliers)</h2>
      <div>
        Filter:
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All</option>
          <option value="customer">Customers</option>
          <option value="supplier">Suppliers</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} style={{ margin: '20px 0', background: '#f7f7f7', padding: '15px' }}>
        <h3>{editingId ? 'Edit Party' : 'Add Party'}</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />&nbsp;
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>&nbsp;
        <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />&nbsp;
        <input name="balance" type="number" step="0.01" placeholder="Opening Balance (positive = debit for customer)" value={form.balance} onChange={handleChange} />&nbsp;
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Contact</th><th>Balance</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {parties.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.contact}</td>
              <td style={{ color: p.balance > 0 ? 'red' : 'green' }}>{p.balance}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.9em', color: '#555' }}>
        For customers, positive balance = they owe you. For suppliers, positive balance = you owe them (depending on your convention). The system updates automatically with invoices/payments.
      </p>
    </div>
  );
}

export default PartyList;