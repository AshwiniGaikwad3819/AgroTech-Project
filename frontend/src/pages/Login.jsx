import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginSuccess } from '../features/auth/authSlice'
import api from '../utils/api'

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login/', form)
      const profile = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${data.access}` },
      })
      dispatch(
        loginSuccess({
          user: profile.data,
          access: data.access,
          refresh: data.refresh,
        }),
      )
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 glass-card border border-white/60 p-8">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-charcoal text-white rounded-3xl p-8">
        <div>
          <p className="gradient-pill bg-white/20 text-white">AgroConnect HQ</p>
          <h2 className="text-3xl font-display mt-6">
            Login to sync your agri-commerce pipeline in real time.
          </h2>
          <p className="text-white/80 mt-4">
            One dashboard for users and admins. Manage products, payments, and
            fulfilment from anywhere.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          <p>• Automated dummy PayPal settlements</p>
          <p>• Order acceptance & tracking timeline</p>
          <p>• Live mandi intelligence & analytics</p>
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-display text-charcoal mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-6">Login to access your AgroConnect workspace.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-1 bg-white"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary text-white font-semibold py-3 disabled:opacity-60 shadow-card"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          New to the platform?{' '}
          <Link to="/register" className="text-primary font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login


