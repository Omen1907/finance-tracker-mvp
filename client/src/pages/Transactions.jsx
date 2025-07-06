import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import FilterBar from '../components/FilterBar'

const apiUrl = import.meta.env.VITE_API_URL

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filters, setFilters] = useState({ category: '', type: '' })
  const [showForm, setShowForm] = useState(false)
  const [editTransaction, setEditTransaction] = useState(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')
        const response = await axios.get(`${apiUrl}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setTransactions(response.data)
        console.log('Fetched transactions:', response.data)
      } catch (error) {
        console.error('Error fetching transactions:', error.message)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = filters.category ? transaction.category === filters.category : true
    const matchesType = filters.type ? transaction.type === filters.type : true
    return matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen bg-black text-beige p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <FilterBar filters={filters} setFilters={setFilters} />

        <TransactionList
          transactions={filteredTransactions}
          setTransactions={setTransactions}
          setEditTransaction={setEditTransaction}
          setShowForm={setShowForm}
        />

        <div className="flex justify-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-peachy text-black px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Add Transaction
          </button>
        </div>

        {showForm && (
          <TransactionForm
            transactions={transactions}
            setTransactions={setTransactions}
            editTransaction={editTransaction}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </div>
  )
}

export default Transactions
