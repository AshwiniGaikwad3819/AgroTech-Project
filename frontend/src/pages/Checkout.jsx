import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/cart/cartSlice";
import api from "../utils/api";
import ProtectedRoute from "../components/ProtectedRoute";

const CheckoutForm = () => {
  const [form, setForm] = useState({
    shipping_address: "",
    contact_phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totals = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderPayload = {
        ...form,
        contact_phone: form.contact_phone || "NA",
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
      };
      const { data: order } = await api.post("/orders/", orderPayload);
      const { data: payment } = await api.post("/payments/", {
        order: order.id,
        provider: "PAYPAL",
      });
      dispatch(clearCart());
      navigate("/orders", {
        state: { success: true, paymentReference: payment.reference },
      });
    } catch (err) {
      setError(err.response?.data || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!items.length) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 glass-card border border-white/50 p-8 space-y-5"
      >
        <div className="space-y-2">
          <p className="gradient-pill w-max">Secure checkout</p>
          <h1 className="text-3xl font-display text-charcoal">
            Confirm delivery & payment
          </h1>
          <p className="text-gray-500 text-sm">
            Add final delivery details and complete payment via dummy PayPal.
            Orders auto-sync to your tracking timeline.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Delivery address
            </label>
            <textarea
              required
              name="shipping_address"
              value={form.shipping_address}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-2 h-28 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Contact phone
            </label>
            <input
              name="contact_phone"
              value={form.contact_phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Additional notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-2xl border border-primary/10 px-4 py-3 mt-2 h-20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500">
            {JSON.stringify(error.items[0])}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-primary text-white font-semibold px-8 py-3 shadow-card disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay via Dummy PayPal"}
        </button>
      </form>

      <div className="glass-card border border-white/50 p-6">
        <h2 className="text-xl font-display text-charcoal mb-4">
          Order summary
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between text-sm text-gray-600"
            >
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-semibold text-charcoal border-t border-white/40 pt-3">
            <span>Total payable</span>
            <span>₹{totals.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => (
  <ProtectedRoute roles={["USER"]}>
    <CheckoutForm />
  </ProtectedRoute>
);

export default Checkout;
