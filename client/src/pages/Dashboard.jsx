import axios from 'axios';
import React, { useEffect } from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, totalSavings: 0 });
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) throw new Error('No token found');

        const summaryResponse = await axios.get(`${apiUrl}/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const savingsResponse = await axios.get(`${apiUrl}/savings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSummary(summaryResponse.data);
        setSavings(savingsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
      }
    };

    fetchDashboardData();
  }, [])

  return (
    <div className="p-4 max-w-6xl mx-auto">
  <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="p-4 bg-green-100 rounded shadow">
      <h2 className="text-lg font-semibold">Total Income</h2>
      <p className="text-xl font-bold">${summary.totalIncome}</p>
    </div>
    <div className="p-4 bg-red-100 rounded shadow">
      <h2 className="text-lg font-semibold">Total Expenses</h2>
      <p className="text-xl font-bold">${summary.totalExpense}</p>
    </div>
    <div className="p-4 bg-blue-100 rounded shadow">
      <h2 className="text-lg font-semibold">Total Savings</h2>
      <p className="text-xl font-bold">${summary.totalSavings}</p>
    </div>
  </div>

  <h2 className="text-xl font-semibold mb-4">Savings Goals</h2>
  {savings.length === 0 ? (
    <p>No savings goals yet.</p>
  ) : (
    <ul className="space-y-4">
      {savings.map(goal => {
        const progress = (goal.saved_amount / goal.target_amount) * 100;

        return (
          <li key={goal.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{goal.title}</h3>
            <p className="mb-2">Saved: ${goal.saved_amount} / ${goal.target_amount}</p>
            <div className="w-full bg-gray-200 rounded h-4">
              <div className="bg-blue-500 h-4 rounded" style={{ width: `${progress}%` }}></div>
            </div>
          </li>
        );
      })}
    </ul>
  )}
</div>

  )
}

export default Dashboard