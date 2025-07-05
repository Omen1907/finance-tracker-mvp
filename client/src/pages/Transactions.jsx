import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import FilterBar from '../components/FilterBar';

const apiUrl = import.meta.env.VITE_API_URL;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ category: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");
        const response = await axios.get(`${apiUrl}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTransactions(response.data);
        console.log('Fetched transactions:', response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = filters.category ? transaction.category === filters.category : true;
    const matchesType = filters.type ? transaction.type === filters.type : true;

    return matchesCategory && matchesType;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <FilterBar filters={filters} setFilters={setFilters} />
      <TransactionList
        transactions={filteredTransactions}
        setTransactions={setTransactions}
        setEditTransaction={setEditTransaction}
        setShowForm={setShowForm}
      />
      <button onClick={() => setShowForm(true)} className="mt-4 btn">
        Add Transaction
      </button>
      {showForm && (
        <TransactionForm
        transactions={transactions}
        setTransactions={setTransactions}
        editTransaction={editTransaction}
        setShowForm={setShowForm}
      />      
      )}
    </div>
  );
};

export default Transactions;
