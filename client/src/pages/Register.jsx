import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.password === '' || formData.confirmPassword === '') {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await axios.post(`${apiUrl}/register`, formData)
      const { token } = response.data

      localStorage.setItem('token', token)
      navigate('/transactions')
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-peachy rounded-lg shadow p-8 space-y-6">
        <div className="flex items-center justify-center mb-6">
          <img
            className="w-10 h-10 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          <span className="text-3xl font-bold text-peachy">FinTrack</span>
        </div>

        <h1 className="text-2xl font-bold text-peachy text-center">
          Create a New Account
        </h1>

        {error && (
          <div className="bg-red-500 text-white text-center py-2 px-4 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-300 font-medium">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-gray-300 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-peachy rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-peachy"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-peachy text-black font-medium py-2 rounded hover:bg-opacity-90 transition"
          >
            Register
          </button>

          <p className="text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link to="/signin" className="text-peachy hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
