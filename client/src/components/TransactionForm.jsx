import React, { useState } from 'react'
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const TransactionForm = ({ transactions, setTransactions} ) => {
    const [formData, setFormData] = useState({
        amount: '',
        category_id: '',
        type: '', // Missing this
        date: '',
        description: ''
      });
      

      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${apiUrl}/transactions`, {
                amount: parseFloat(formData.amount),
                category_id: formData.category_id,
                type: formData.type, // Add this
                date: formData.date,
                description: formData.description
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });              

            setTransactions([...transactions, response.data]);
            setFormData({
                amount: '',
                category_id: '',
                type: '', // Reset this
                date: '',
                description: ''
              });              
        } catch (error) {
            console.error('Error adding transaction:', error.message);
          }
      };

  return (
    <div>
        <h2>Add transaction</h2>
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
            <label>Category</label>
            <input
              type="text"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            />
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
          <button
            type="submit"
          >
            Add Transaction
          </button>
        </form>
    </div>
  )
}

export default TransactionForm