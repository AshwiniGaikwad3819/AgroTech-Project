import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import api from "../utils/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity }));
  };

  if (loading)
    return <div className="py-10 text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
      {/* Product Image */}
      <div className="glass-card border-white/70 overflow-hidden rounded-2xl lg:rounded-3xl sticky top-4 self-start">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-[320px] sm:h-[400px] lg:h-[480px] w-full object-contain bg-white p-4"
          />
        ) : (
          <div className="h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center text-gray-400 bg-primary/5">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="font-medium text-sm">Visual coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-4 lg:space-y-5">
        {/* Header Section */}
        <div className="space-y-3">
          <span className="inline-block gradient-pill text-xs font-semibold">
            {product.category_name}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-charcoal leading-tight">
            {product.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Price & Availability */}
        <div className="glass-card border-white/50 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Price</p>
              <p className="text-3xl sm:text-4xl font-display text-primary font-bold">
                ₹{Number(product.price).toFixed(2)}
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <p
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                  product.available_quantity == 0
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {product.available_quantity} {product.unit} in stock
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="pt-3 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Quantity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={product?.available_quantity ?? 999999}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? "" : Number(val));
                }}
                className="w-24 rounded-xl border-2 border-gray-200 px-3 py-2 text-center 
               text-base font-semibold bg-white focus:outline-none 
               focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <span className="text-gray-500 text-sm">{product.unit}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="w-full rounded-xl bg-primary text-white font-bold text-base px-6 py-3 shadow-lg hover:shadow-xl hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </button>
        </div>

        {/* Seller Information */}
        <div className="glass-card border-white/50 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">
                Seller Details
              </p>
              <p className="text-base sm:text-lg font-bold text-charcoal truncate">
                {product.owner?.name}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-start gap-2 text-gray-600">
              <svg
                className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <p className="text-xs sm:text-sm">
                {product.owner?.phone || "Contact details shared after booking"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
