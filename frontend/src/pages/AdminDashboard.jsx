import { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import SectionHeader from '../components/SectionHeader'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import api from '../utils/api'

const AdminDashboardContent = () => {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])

  const loadData = async () => {
    try {
      const [statsRes, productsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/auth/stats/'),
        api.get('/products/admin/all/'),
        api.get('/auth/users/'),
        api.get('/orders/'),
      ])
      setStats(statsRes.data)
      setProducts(productsRes.data.slice(0, 5))
      setUsers(usersRes.data)
      setOrders(ordersRes.data.results || ordersRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Removed supplier approval logic as we now have only ADMIN and USER roles
  // const handleSupplierApproval = async (userId, isApproved) => {
  //   try {
  //     await api.patch(`/auth/suppliers/${userId}/approval/`, { is_supplier_approved: isApproved })
  //     loadData()
  //   } catch (err) {
  //     alert(err.response?.data || 'Unable to update supplier')
  //   }
  // }

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Admin overview"
        title="Control center"
        description="Monitor registrations, product listings and orders."
        actions={<Button variant="primary">Download report</Button>}
      />
      {stats && (
        <div className="grid sm:grid-cols-3 gap-6">
          {Object.entries(stats).map(([key, value]) => (
            <StatCard key={key} label={key} value={value} />
          ))}
        </div>
      )}
      <div className="glass-card border border-white/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-charcoal">Recent listings</h2>
          <button className="text-sm text-primary">View all</button>
        </div>
        <div className="divide-y divide-gray-100">
          {products.map((product) => (
            <div key={product.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{product.title}</p>
                <p className="text-xs text-gray-500 capitalize">{product.product_type}</p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                ₹{Number(product.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card border border-white/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display text-charcoal">User directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="py-2 text-sm font-semibold text-gray-900">{user.username}</td>
                  <td className="py-2 text-sm capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card border border-white/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display text-charcoal">Recent orders</h2>
        </div>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-primary/10 p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="font-semibold text-charcoal">{order.status.replace('_', ' ')}</p>
                </div>
                <p className="text-sm font-semibold text-primary">
                  ₹{Number(order.total_amount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AdminDashboard = () => (
  <ProtectedRoute roles={['ADMIN']}>
    <AdminDashboardContent />
  </ProtectedRoute>
)

export default AdminDashboard


