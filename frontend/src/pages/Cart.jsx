import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../features/cart/cartSlice";
import useAuth from "../hooks/useAuth";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16 glass-card border border-white/50">
        <p className="text-lg text-gray-600 mb-4">
          Please login to manage your cart.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-card"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 40 : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [items]);

  if (!items.length) {
    return (
      <div className="text-center py-16 glass-card border border-white/50">
        <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-card hover:-translate-y-0.5 transition"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4 ">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="glass-card border border-white/60 p-4 flex gap-4 items-center"
          >
            <div className="h-24 w-32 rounded-2xl bg-primary/5 flex items-center justify-center">
              {item.product.thumbnail ? (
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase text-primary font-semibold">
                    {item.product.category_name}
                  </p>
                  <h3 className="text-lg font-display text-charcoal">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.product.owner?.name}
                  </p>
                </div>
                <button
                  className="text-xs text-red-500 px-3 py-1 rounded-full bg-red-50"
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQuantity({
                          id: item.product.id,
                          quantity: Number(e.target.value),
                        })
                      )
                    }
                    className="w-20 rounded-2xl border border-primary/10 px-3 py-1 bg-white"
                  />
                </div>
                <p className="text-lg font-semibold text-primary">
                  ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-red-500 underline hover:text-red-800 "
        >
          Clear cart
        </button>
      </div>

      <div className="glass-card border border-white/50 p-6 space-y-4 h-fit">
        <h2 className="text-xl font-display text-charcoal">Order summary</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{totals.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 text-base">
            <span>Total</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full rounded-2xl bg-primary text-white font-semibold py-3 shadow-card hover:-translate-y-0.5 transition"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
