import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import api from '../utils/api'

const initialProduct = {
  title: '',
  description: '',
  price: '',
  available_quantity: '',
  unit: 'kg',
  location: '',
  category: '',
  product_type: 'PRODUCE',
}

const SellerDashboard = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(initialProduct)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  // console.log(categories)

  const loadData = async () => {
    try {
      const [categoryRes, productRes, orderRes] = await Promise.all([
        api.get('/products/categories/'),
        api.get('/products/mine/'),
        api.get('/orders/'),
      ])
      setCategories(categoryRes.data)
      setProducts(productRes.data)
      setOrders(orderRes.data.results || orderRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleInput = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/products/', {
        ...form,
        price: parseFloat(form.price),
        available_quantity: parseInt(form.available_quantity, 10),
      })
      setForm(initialProduct)
      loadData()
    } catch (err) {
      alert(err.response?.data || 'Unable to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleAccept = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/accept/`)
      loadData()
    } catch (err) {
      alert(err.response?.data || 'Unable to accept order')
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Seller cockpit"
        title="Manage inventory & fulfilment"
        description="Add or update listings, track incoming orders, and confirm fulfilment when payments clear."
      />

      <div className="glass-card border border-white/60 p-6 space-y-6">
        <h2 className="text-xl font-display text-charcoal">Add new product</h2>
        <form onSubmit={handleCreateProduct} className="grid md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            placeholder="Title"
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
            required
          />
          <select
            name="product_type"
            value={form.product_type}
            onChange={handleInput}
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
          >
            <option value="PRODUCE">Produce</option>
            <option value="INPUT">Input</option>
          </select>
          <select
            name="category"
            value={form.category}
            onChange={handleInput}
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            name="price"
            value={form.price}
            onChange={handleInput}
            placeholder="Price"
            type="number"
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
            required
          />
          <input
            name="available_quantity"
            value={form.available_quantity}
            onChange={handleInput}
            placeholder="Quantity"
            type="number"
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
            required
          />
          <input
            name="unit"
            value={form.unit}
            onChange={handleInput}
            placeholder="Unit (kg, bags, etc)"
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleInput}
            placeholder="Location"
            className="rounded-2xl border border-primary/10 px-4 py-3 bg-white"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            placeholder="Description"
            className="md:col-span-2 rounded-2xl border border-primary/10 px-4 py-3 bg-white h-28"
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Publish product'}
            </Button>
          </div>
        </form>
      </div>

      <div className="glass-card border border-white/60 p-6">
        <SectionHeader
          eyebrow="Inventory"
          title="Your listings"
          description="Edit or deactivate directly from admin panel if needed."
        />
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">No products yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-primary/10 p-4 bg-white">
                <p className="text-xs uppercase text-gray-500">{product.product_type}</p>
                <p className="font-semibold text-charcoal">{product.title}</p>
                <p className="text-sm text-gray-500">
                  ₹{Number(product.price).toFixed(2)} • {product.available_quantity} {product.unit}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card border border-white/60 p-6 space-y-4">
        <SectionHeader
          eyebrow="Fulfilment"
          title="Open orders"
          description="Accept paid orders and update tracking to keep buyers informed."
        />
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-primary/10 p-4 bg-white">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="font-semibold text-charcoal">{order.status.replace('_', ' ')}</p>
                  </div>
                  {order.status === 'PAID' && (
                    <Button variant="outline" size="sm" onClick={() => handleAccept(order.id)}>
                      Accept order
                    </Button>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.product_detail?.title} × {item.quantity}
                      </span>
                      <span>₹{(item.quantity * Number(item.unit_price)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard

