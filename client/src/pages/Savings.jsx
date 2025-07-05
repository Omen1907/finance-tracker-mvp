import React, { useEffect, useState } from 'react'
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [addAmounts, setAddAmounts] = useState({});


  useEffect(() => {
    const fetchSavings = async () => {
      try{
        const token = localStorage.getItem('token');
        if(!token){
          throw new Error("No token found");
        }
        const response = await axios.get(`${apiUrl}/savings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSavings(response.data);
        console.log('Fetched savings:', response.data);
      } catch (error) {
        console.error('Error fetching savings:', error.message);
      }
    }

    fetchSavings();
  }, []);

  useEffect(() => {
    const total = savings.reduce((sum, entry) => sum + entry.saved_amount, 0);
    setTotalSavings(total);
  }, [savings]);  

  const handleAddToSavings = async (goalId) => {
    try {
      const amountToAdd = parseFloat(addAmounts[goalId]);
      if (isNaN(amountToAdd) || amountToAdd <= 0) {
        alert('Please enter a valid positive number.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.put(`${apiUrl}/savings/${goalId}`, {
        amount: amountToAdd,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedSavings = savings.map(goal =>
        goal.id === goalId ? response.data : goal
      );      

      setSavings(updatedSavings);

      setAddAmounts({ ...addAmounts, [goalId]: '' });
      alert('Savings updated successfully!');
    } catch (error) {
      console.error('Error updating savings goal:', error.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Your Savings</h1>

    <h2 className="text-lg font-semibold mb-2">Total Saved: ${totalSavings}</h2>

    {savings.length === 0 ? (
      <p>No savings goals found.</p>
    ) : (
      <ul className="space-y-4">
        {savings.map((goal) => (
          <li key={goal.id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold">{goal.title}</h3>
            <p>Saved: ${goal.saved_amount} / ${goal.target_amount}</p>
            <input
              type="number"
              placeholder="Add amount"
              value={addAmounts[goal.id] || ''}
              onChange={(e) => setAddAmounts({ ...addAmounts, [goal.id]: e.target.value })}
              className="p-2 border rounded w-32 mr-2"
            />
            <button
              onClick={() => handleAddToSavings(goal.id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    )}

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No token found');

          const response = await axios.post(`${apiUrl}/savings`, {
            title,
            target_amount: parseFloat(targetAmount), // make sure it's a number
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Add new saving to list immediately
          setSavings([...savings, response.data]);
          setTitle('');
          setTargetAmount('');
          console.log('Savings goal added:', response.data);
        } catch (error) {
          console.error('Error adding savings goal:', error.message);
        }
      }}
      className="mb-4 p-4 border rounded space-y-4"
    >
      <div>
        <label className="block mb-1 font-semibold">Savings Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Target Amount</label>
        <input
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Savings Goal
      </button>
    </form>
  </div>
  )
}

export default Savings