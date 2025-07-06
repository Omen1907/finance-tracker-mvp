import React, { useEffect, useState } from 'react'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

const Savings = () => {
  const [savings, setSavings] = useState([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [addAmounts, setAddAmounts] = useState({})

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const response = await axios.get(`${apiUrl}/savings`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setSavings(response.data)
        console.log('Fetched savings:', response.data)
      } catch (error) {
        console.error('Error fetching savings:', error.message)
      }
    }

    fetchSavings()
  }, [])

  useEffect(() => {
    const total = savings.reduce((sum, entry) => sum + entry.saved_amount, 0)
    setTotalSavings(total)
  }, [savings])

  const handleAddToSavings = async (goalId) => {
    try {
      const amountToAdd = parseFloat(addAmounts[goalId])
      if (isNaN(amountToAdd) || amountToAdd <= 0) {
        alert('Please enter a valid positive number.')
        return
      }

      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const response = await axios.put(`${apiUrl}/savings/${goalId}`, { amount: amountToAdd }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const updatedSavings = savings.map(goal =>
        goal.id === goalId ? response.data : goal
      )

      setSavings(updatedSavings)
      setAddAmounts({ ...addAmounts, [goalId]: '' })
      alert('Savings updated successfully!')
    } catch (error) {
      console.error('Error updating savings goal:', error.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-beige p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-peachy">Your Savings</h1>

        <h2 className="text-xl font-semibold text-peachy">Total Saved: ${totalSavings}</h2>

        {savings.length === 0 ? (
          <p className="text-gray-400">No savings goals found.</p>
        ) : (
          <ul className="space-y-4">
            {savings.map((goal) => (
              <li key={goal.id} className="p-4 border border-peachy rounded-lg shadow hover:shadow-peachy transition">
                <h3 className="text-2xl font-semibold text-peachy">{goal.title}</h3>
                <p className="mb-2 text-gray-300">Saved: ${goal.saved_amount} / ${goal.target_amount}</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Add amount"
                    value={addAmounts[goal.id] || ''}
                    onChange={(e) => setAddAmounts({ ...addAmounts, [goal.id]: e.target.value })}
                    className="p-2 border border-peachy rounded w-32 bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
                  />
                  <button
                    onClick={() => handleAddToSavings(goal.id)}
                    className="bg-peachy text-black px-3 py-1 rounded hover:bg-opacity-90 transition"
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              const token = localStorage.getItem('token')
              if (!token) throw new Error('No token found')

              const response = await axios.post(`${apiUrl}/savings`, {
                title,
                target_amount: parseFloat(targetAmount)
              }, {
                headers: { Authorization: `Bearer ${token}` }
              })

              setSavings([...savings, response.data])
              setTitle('')
              setTargetAmount('')
              console.log('Savings goal added:', response.data)
            } catch (error) {
              console.error('Error adding savings goal:', error.message)
            }
          }}
          className="p-6 border border-peachy rounded-lg space-y-4 bg-gray-900"
        >
          <h3 className="text-2xl font-semibold text-peachy">Add New Savings Goal</h3>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Savings Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Target Amount</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-peachy text-black px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Add Savings Goal
          </button>
        </form>
      </div>
    </div>
  )
}

export default Savings
