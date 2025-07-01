import React from 'react'

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
    const { id, category, description, amount, type, date } = transaction;

  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <div className="font-semibold">{category}</div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</div>
      </div>

      <div className="flex items-center gap-4">
        <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {type === 'income' ? '+' : '-'} ${amount}
        </span>
        <button onClick={() => onEdit(transaction)} className="text-blue-500">Edit</button>
        <button onClick={() => onDelete(id)} className="text-red-500">Delete</button>
      </div>
    </div>
  )
}

export default TransactionItem