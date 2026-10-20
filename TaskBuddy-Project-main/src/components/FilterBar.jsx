import React from 'react'

export default function FilterBar({ filters, setFilters }) {
  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value })

  return (
    <div className='filter-bar'>
      <input
        type="search"
        placeholder='Search tasks…'
        value={filters.search}
        onChange={set('search')}
      />
      <select value={filters.status} onChange={set('status')}>
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
      </select>
      <select value={filters.priority} onChange={set('priority')}>
        <option value="All">Any priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select value={filters.category} onChange={set('category')}>
        <option value="All">Any category</option>
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
    </div>
  )
}
