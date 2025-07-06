import React from 'react'

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { id, category, description, amount, type, date } = transaction

  return (
    <div className="flex justify-between items-center border-b border-peachy py-4 text-beige">
      <div>
        <div className="font-semibold text-peachy">{category}</div>
        <div className="text-sm text-gray-400">{description}</div>
        <div className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</div>
      </div>

      <div className="flex items-center gap-4">
        <span className={type === 'income' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
          {type === 'income' ? '+' : '-'} ${amount}
        </span>
        <button
          onClick={() => onEdit(transaction)}
          className="text-peachy hover:underline hover:text-opacity-80 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:underline hover:text-opacity-80 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TransactionItem
