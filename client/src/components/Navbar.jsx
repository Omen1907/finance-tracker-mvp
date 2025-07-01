import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white">
        <Link to="/">Home</Link>
        <Link to="/Dashboard">Dashboard</Link>
        <button>Logout</button>
    </nav>
  )
}

export default Navbar