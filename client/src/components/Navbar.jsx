import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }

  return (
    <nav className="flex gap-6 p-4 bg-black text-beige shadow-md">
      <Link
        to="/"
        className="hover:text-peachy hover:underline transition"
      >
        Home
      </Link>
      <Link
        to="/Dashboard"
        className="hover:text-peachy hover:underline transition"
      >
        Dashboard
      </Link>
      <Link
        to="/Transactions"
        className="hover:text-peachy hover:underline transition"
      >
        Transactions
      </Link>
      <Link
        to="/Savings"
        className="hover:text-peachy hover:underline transition"
      >
        Savings
      </Link>
      <button
        onClick={handleLogout}
        className="ml-auto bg-peachy text-black px-4 py-1 rounded hover:bg-opacity-90 transition"
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar
