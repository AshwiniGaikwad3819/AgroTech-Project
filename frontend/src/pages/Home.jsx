import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import {
  fetchCategories,
  fetchProducts,
} from "../features/products/productsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { items, categories, status } = useSelector((state) => state.products);
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    dispatch(fetchProducts({ page_size: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="space-y-16">
      <Hero />

      <section className="glass-card border border-white/50 p-8">
        <SectionHeader
          eyebrow="Categories"
          title="What’s trending in the marketplace"
          description="Curated supplies and fresh produce from trusted sellers. Compare real-time prices, quality and delivery speeds across every region."
          // actions={<Button variant="ghost">View all categories</Button>}
        />
        <div className="flex flex-wrap gap-3">
          {safeCategories.slice(0, 10).map((category, idx) => (
            <span
              key={category.id}
              className="px-4 py-2 rounded-full bg-white border border-primary/10 text-sm text-charcoal shadow-soft flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              {category.name}
            </span>
          ))}
          {safeCategories.length === 0 && (
            <p className="text-sm text-gray-500">No categories yet.</p>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Featured"
          title="Fresh inputs & produce shipping this week"
          description="Order certified hybrids, smart irrigation kits, precision tools, and farm-fresh harvest directly from verified networks."
        />
        {status === "loading" ? (
          <div className="text-center py-12 text-gray-500">
            Loading products...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {safeItems.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {safeItems.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No products published yet.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="stat-card p-8 space-y-4">
          <p className="text-sm text-primary font-semibold uppercase tracking-[0.35em]">
            Why AgroConnect
          </p>
          <h2 className="text-3xl font-display font-semibold text-charcoal">
            Built for farmers and buyers in modern agri-commerce
          </h2>
          <p className="text-gray-600">
            A simple and transparent platform where farmers can list their crops
            and buyers can purchase directly. No middlemen, faster updates, and
            secure digital tracking from listing to delivery.
          </p>
        </div>

        {/* Farmer / Admin */}
        <div className="stat-card p-8 space-y-3">
          <h3 className="font-semibold text-xl text-charcoal">
            Farmers / Admin
          </h3>
          <p className="text-gray-600">
            Add product listings, manage stock, update pricing, and track orders
            directly from your dashboard with complete transparency.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Add and manage crop listings</li>
            <li>• Update prices and quantities anytime</li>
            <li>• Track orders and buyer requests</li>
          </ul>
        </div>

        {/* Buyer / User */}
        <div className="stat-card p-8 space-y-3">
          <h3 className="font-semibold text-xl text-charcoal">
            Buyers / Users
          </h3>
          <p className="text-gray-600">
            View real-time product listings directly from farmers, place orders,
            make payments, and track delivery with a fully digital flow.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Explore verified crop listings</li>
            <li>• Place orders instantly</li>
            <li>• Track order and delivery status</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
