import React, { useState, useEffect } from 'react';
import API from '../api';

function Ledger() {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => { axios.get('/api/parties?type=customer').then(r => setParties(r.data)); }, []);

  useEffect(() => {
    if (selectedParty) {
      API.get(`/api/transactions?party=${selectedParty}`).then(r => {
        setTransactions(r.data);
        API.get(`/api/parties/${selectedParty}`).then(r2 => setBalance(r2.data.balance));
      });
    }
  }, [selectedParty]);

  return (
    <div>
      <h2>Customer Ledger</h2>
      <select onChange={e => setSelectedParty(e.target.value)} value={selectedParty}>
        <option value="">Select Customer</option>
        {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      {selectedParty && <h3>Current Balance: {balance} (positive = owes us)</h3>}
      <table border="1">
        <thead><tr><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th></tr></thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>{tx.debit}</td>
              <td>{tx.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Ledger;