import axios from 'axios'
import React, { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, totalSavings: 0 })
  const [savings, setSavings] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const summaryResponse = await axios.get(`${apiUrl}/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const savingsResponse = await axios.get(`${apiUrl}/savings`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setSummary(summaryResponse.data)
        setSavings(savingsResponse.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-black text-beige p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-peachy">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-peachy bg-gray-900 rounded-lg shadow hover:shadow-peachy transition">
            <h2 className="text-lg font-semibold text-gray-300">Total Income</h2>
            <p className="text-2xl font-bold text-peachy">${summary.totalIncome}</p>
          </div>
          <div className="p-6 border border-peachy bg-gray-900 rounded-lg shadow hover:shadow-peachy transition">
            <h2 className="text-lg font-semibold text-gray-300">Total Expenses</h2>
            <p className="text-2xl font-bold text-peachy">${summary.totalExpense}</p>
          </div>
          <div className="p-6 border border-peachy bg-gray-900 rounded-lg shadow hover:shadow-peachy transition">
            <h2 className="text-lg font-semibold text-gray-300">Total Savings</h2>
            <p className="text-2xl font-bold text-peachy">${summary.totalSavings}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-peachy mb-4">Savings Goals</h2>
          {savings.length === 0 ? (
            <p className="text-gray-400">No savings goals yet.</p>
          ) : (
            <ul className="space-y-4">
              {savings.map(goal => {
                const progress = (goal.saved_amount / goal.target_amount) * 100

                return (
                  <li key={goal.id} className="p-4 border border-peachy rounded-lg shadow hover:shadow-peachy transition">
                    <h3 className="text-lg font-semibold text-peachy">{goal.title}</h3>
                    <p className="mb-2 text-gray-300">
                      Saved: ${goal.saved_amount} / ${goal.target_amount}
                    </p>
                    <div className="w-full bg-gray-700 rounded h-4">
                      <div
                        className="bg-peachy h-4 rounded transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
