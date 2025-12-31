import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import {
  fetchCategories,
  fetchProducts,
} from "../features/products/productsSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { items, categories, status } = useSelector((state) => state.products);
  const safeCategories = Array.isArray(categories) ? categories : [];
  // console.log(categories.results[0].name)
  const safeItems = Array.isArray(items) ? items : [];
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
  });
  console.log(filters);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleInput = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-10">
      <div className="glass-card border border-white/50 p-8 space-y-6">
        <SectionHeader
          eyebrow="Marketplace"
          title="Hyperlocal agriculture at national scale"
          description="Browse certified inputs, modern tools and fresh produce from trusted sellers. Filter by category, type, or search keywords."
          actions={
            <Button
              variant="ghost"
              onClick={() => setFilters({ type: "", category: "", search: "" })}
            >
              Reset filters
            </Button>
          }
        />
        {/* {console.log(filters.search)} */}
        <div className="grid md:grid-cols-4 gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search fertilizer, pumps, tomatoes..."
            value={filters.search}
            onChange={handleInput}
            className="rounded-2xl border border-primary/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 2-white"
          />
          <div className="rounded-2xl border border-primary/10 bg-white px-4 py-3 flex flex-col gap-2">
            <label className="text-xs text-gray-500">Product type</label>
            <div className="flex gap-2">
              {["", "INPUT", "PRODUCE"].map((type) => (
                <button
                  key={type || "all"}
                  name="type"
                  value={type}
                  onClick={() => setFilters((prev) => ({ ...prev, type }))}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    filters.type === type
                      ? "bg-primary text-white"
                      : "bg-primary/5 text-primary hover:bg-primary/10"
                  }`}
                  type="button"
                >
                  {type === ""
                    ? "All Types"
                    : type === "INPUT"
                    ? "Inputs"
                    : "Produce"}
                </button>
              ))}
            </div>
          </div>
          <select
            name="category"
            value={filters.category}
            onChange={handleInput}
            className="rounded-2xl border border-primary/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="">All categories</option>
            {safeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className="text-center py-20 text-gray-500">
          Fetching products...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {safeItems.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No products found for selected filters.
            </div>
          ) : (
            safeItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
