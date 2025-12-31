import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ProtectedRoute from '../components/ProtectedRoute'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'
import { useLocation } from 'react-router-dom'

const statusLabel = (status) => status.replace('_', ' ')

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [actionLoading, setActionLoading] = useState(false)
  const { user, role } = useAuth()
  const location = useLocation()
  const [flash, setFlash] = useState(
    location.state?.success
      ? {
          message: `Payment successful. Reference: ${location.state.paymentReference || 'N/A'}`,
          type: 'success',
        }
      : null,
  )

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/orders/')
      setOrders(data.results || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  useEffect(() => {
    if (location.state?.success) {
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const canManage = (order) => {
    return role === 'ADMIN'
  }

  const handleAccept = async (orderId) => {
    setActionLoading(true)
    try {
      await api.post(`/orders/${orderId}/accept/`)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      alert(err.response?.data?.detail || 'Unable to accept order')
    } finally {
      setActionLoading(false)
    }
  }

  const handleTrackingUpdate = async (orderId) => {
    const note = window.prompt('Enter tracking note', 'Dispatched from warehouse')
    if (note === null) return
    const status = window.prompt(
      'Update status (optional: CREATED, PAID, IN_PROGRESS, COMPLETED, CANCELLED)',
      '',
    )
    setActionLoading(true)
    try {
      await api.post(`/orders/${orderId}/tracking/`, {
        note: note || '',
        status: status || undefined,
      })
      setRefreshKey((key) => key + 1)
    } catch (err) {
      alert(err.response?.data || 'Failed to add tracking record')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-gray-500">Loading orders...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">
          Track purchase history, payment status and fulfilment.
        </p>
      </div>
      {flash && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 px-4 py-3">
          {flash.message}
        </div>
      )}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center text-gray-500">
          No orders placed yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">#{order.id}</p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dayjs(order.created_at).format('DD MMM YYYY')}
                  </h3>
                </div>
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                  {statusLabel(order.status)}
                </span>
              </div>
              {canManage(order) && order.status === 'PAID' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleAccept(order.id)}
                  className="inline-flex text-sm font-semibold text-primary"
                >
                  {actionLoading ? 'Updating...' : 'Accept order'}
                </button>
              )}
              <div className="space-y-2 text-sm text-gray-600">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product_detail?.title} × {item.quantity}
                    </span>
                    <span>₹{(item.quantity * Number(item.unit_price)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total paid</span>
                <span>₹{Number(order.total_amount || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Tracking updates</p>
                  {canManage(order) && (
                    <button
                      className="text-xs font-semibold text-primary"
                      onClick={() => handleTrackingUpdate(order.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : 'Add update'}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(order.tracking || []).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-wrap items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-2xl px-3 py-2"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{statusLabel(entry.status)}</p>
                        <p>{entry.note}</p>
                        <p className="text-[11px] text-gray-500">
                          {entry.actor?.name || 'System'} • {entry.actor?.role || 'N/A'}
                        </p>
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {dayjs(entry.created_at).format('DD MMM, HH:mm')}
                      </span>
                    </div>
                  ))}
                  {(order.tracking || []).length === 0 && (
                    <p className="text-xs text-gray-400">No tracking updates yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Orders = () => (
  <ProtectedRoute>
    <OrdersList />
  </ProtectedRoute>
)

export default Orders

