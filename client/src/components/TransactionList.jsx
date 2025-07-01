import React from 'react';
import TransactionItem from './TransactionItem';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const TransactionList = ({ transactions, setTransactions, setEditTransaction, setShowForm }) => {

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Delete transaction with ID:', id);

            const response = await axios.delete(`${apiUrl}/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Delete response:", response.data);

            setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));

        } catch (err) {
            console.error("Error deleting transaction:", err.response?.data || err.message);
        }
    };

    const handleEdit = (transaction) => {
        setEditTransaction(transaction);
        setShowForm(true);
    };

    return (
        <div className="space-y-4">
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
};

export default TransactionList;
