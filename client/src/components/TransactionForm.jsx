import React, { useState, useEffect } from 'react'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

const TransactionForm = ({ transactions, setTransactions, editTransaction, setShowForm }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: '',
    date: '',
    description: ''
  })

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Salary']

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: editTransaction.amount,
        category: editTransaction.category,
        type: editTransaction.type,
        date: editTransaction.date,
        description: editTransaction.description
      })
    }
  }, [editTransaction])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      let response

      if (editTransaction) {
        response = await axios.put(`${apiUrl}/transactions/${editTransaction.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const updatedTransactions = transactions.map(t =>
          t.id === editTransaction.id ? response.data : t
        )
        setTransactions(updatedTransactions)
      } else {
        response = await axios.post(`${apiUrl}/transactions`, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type,
          date: formData.date,
          description: formData.description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setTransactions([...transactions, response.data])
      }

      setFormData({
        amount: '',
        category: '',
        type: '',
        date: '',
        description: ''
      })

      setShowForm(false)

    } catch (error) {
      if (error.response) {
        console.error('Error saving transaction:', error.response.data.error)
      } else {
        console.error('Error saving transaction:', error.message)
      }
    }
  }

  return (
    <div className="bg-gray-900 border border-peachy p-6 rounded-lg space-y-6 text-beige">
      <h2 className="text-2xl font-bold text-peachy mb-4">{editTransaction ? 'Edit' : 'Add'} Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="space-y-2">
          <legend className="font-semibold text-gray-300 mb-1">Type</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-1 text-gray-300">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
              />
              Income
            </label>
            <label className="flex items-center gap-1 text-gray-300">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
              />
              Expense
            </label>
          </div>
        </fieldset>

        <div>
          <label className="block mb-1 text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-peachy text-black font-medium py-2 px-4 rounded hover:bg-opacity-90 transition"
          >
            {editTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-red-400 hover:underline hover:text-opacity-80 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
