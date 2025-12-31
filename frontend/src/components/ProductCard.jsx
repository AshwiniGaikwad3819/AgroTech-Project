import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import useAuth from '../hooks/useAuth'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/products/${product.id}` } })
      return
    }
    dispatch(
      addToCart({
        product,
        quantity: 1,
      }),
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-white/70 shadow-soft overflow-hidden flex flex-col hover:-translate-y-1 transition">
      <div className="relative h-44 bg-primary/5 flex items-center justify-center overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Preview coming soon</span>
        )}
        <span className="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full text-primary">
          {product.product_type === 'INPUT' ? 'Input supply' : 'Farm produce'}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{product.category_name}</p>
        <Link to={`/products/${product.id}`} className="text-lg font-display text-charcoal hover:text-primary">
          {product.title}
        </Link>
        <p className="text-sm text-gray-500 flex-1">
          {product.description?.slice(0, 80) || 'No description yet.'}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-2xl font-display text-primary">₹{Number(product.price).toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              {product.available_quantity} {product.unit} in stock
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white px-4 py-2 text-sm font-semibold shadow-card hover:-translate-y-0.5 transition"
          >
            <ShoppingBagIcon className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
}

export default ProductCard


