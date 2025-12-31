import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { items = [], categories = [] } = useSelector(
    (state) => state.products
  );

  const stats = [
    { label: "Active Users", value: "12,540+" },
    { label: "Total Products", value: items.length || 0 },
    { label: "Categories", value: categories.length || 0 },
  ];

  return (
    <section className="relative w-full bg-[#F6F9FC] rounded-2xl px-6 sm:px-10 md:px-14 py-10 sm:py-14 shadow-sm border border-[#E5E9F0]">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* LEFT CONTENT */}  
        <div className="space-y-5 sm:space-y-6">
          <span className="inline-block text-[10px] sm:text-xs tracking-widest uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
            India’s Trusted Agri Marketplace
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-800">
            Everything You Need For Modern{" "}
            <span className="text-blue-600">Agriculture</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-lg">
            Discover genuine equipment, fertilizers, seeds, irrigation tools,
            and fresh inputs — all from trusted and verified agri sellers across
            India.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition text-center"
            >
              Shop Now →
            </Link>

            <Link
              to="/sell"
              className="border border-blue-200 px-6 py-3 rounded-xl font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition text-center"
            >
              Become a Seller
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-200 rounded-xl px-3 py-3 sm:px-4 text-center shadow-sm"
              >
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {s.value}
                </p>
                <p className="text-[11px] sm:text-sm text-gray-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION – Minimal Cards */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700">Total Products</p>
                <p className="text-2xl sm:text-3xl font-semibold text-blue-600">
                  {items.length}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700">Active Users</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-800">
                  12,540
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700">Categories</p>
                <p className="text-2xl sm:text-3xl font-semibold text-blue-600">
                  {categories.length}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-blue-700">Daily Visitors</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-800">
                  4,800
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
