import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    address_line: '',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await api.post('/auth/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirm: form.password_confirm,
        address_line: form.address_line,
      })
      setSuccess('Account created successfully. Please login.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.password || 'Failed to register')
    }
  }

  return (
    <div className="glass-card border border-white/60 p-8">
      <div className="mb-6 space-y-2">
        <p className="gradient-pill w-max">Join AgroConnect</p>
        <h1 className="text-3xl font-display text-charcoal">Create your account</h1>
        <p className="text-gray-500">
          Register to access the marketplace. Buyers get USER access by default. Seller/Admin access is granted separately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Username*</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email*</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password*</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Confirm password*</label>
          <input
            type="password"
            name="password_confirm"
            value={form.password_confirm}
            onChange={handleChange}
            className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address_line"
            value={form.address_line}
            onChange={handleChange}
            className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 h-24 bg-white"
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 md:col-span-2">
            {Array.isArray(error) ? error.join(', ') : error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 md:col-span-2">{success}</p>
        )}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-2xl bg-primary text-white font-semibold py-3 shadow-card"
          >
            Create account
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already registered?{' '}
        <Link to="/login" className="text-primary font-semibold">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Register


