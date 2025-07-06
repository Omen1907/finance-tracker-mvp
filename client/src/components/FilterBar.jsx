import React from 'react'

const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="p-2 border border-peachy rounded bg-black text-beige focus:outline-none focus:ring-2 focus:ring-peachy"
      >
        <option value="">All Categories</option>
        {/* Later: map categories here */}
        <option value="Food">Food</option>
        <option value="Rent">Rent</option>
        <option value="Salary">Salary</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        className="p-2 border border-peachy rounded bg-black text-beige focus:outline-none focus:ring-2 focus:ring-peachy"
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>
  )
}

export default FilterBar
