import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const TransactionForm = ({ transactions, setTransactions, editTransaction, setShowForm }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: '',
    date: '',
    description: ''
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Salary'];

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: editTransaction.amount,
        category: editTransaction.category,
        type: editTransaction.type,
        date: editTransaction.date,
        description: editTransaction.description
      });
    }
  }, [editTransaction]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      let response;

      if (editTransaction) {
        response = await axios.put(`${apiUrl}/transactions/${editTransaction.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const updatedTransactions = transactions.map(t =>
          t.id === editTransaction.id ? response.data : t
        );
        setTransactions(updatedTransactions);
      } else {
        response = await axios.post(`${apiUrl}/transactions`, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type,
          date: formData.date,
          description: formData.description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTransactions([...transactions, response.data]);
      }

      setFormData({
        amount: '',
        category: '',
        type: '',
        date: '',
        description: ''
      });

      setShowForm(false);

    } catch (error) {
      if (error.response) {
        console.error('Error saving transaction:', error.response.data.error);
      } else {
        console.error('Error saving transaction:', error.message);
      }
    }
  };

  return (
    <div>
      <h2>{editTransaction ? 'Edit' : 'Add'} Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend>Type</legend>
          <label>
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
            />
            Income
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
            />
            Expense
          </label>
        </fieldset>
        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {editTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  )
};

export default TransactionForm;
