import {
  Bars3Icon,
  ShoppingCartIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  // console.log(cartItems.length);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { isAuthenticated, user, role } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const baseNav = [
    { label: "Home", to: "/" },
    { label: "Marketplace", to: "/products" },
    { label: "Sell", to: "/sell" },
  ];
  const roleNav = [];
  if (isAuthenticated) {
    roleNav.push({ label: "Orders", to: "/orders" });
    if (role === "ADMIN") {
      roleNav.push({ label: "Admin Panel", to: "/admin" });
      roleNav.push({ label: "Seller", to: "/dashboard/seller" });
    }
    // Removed legacy FARMER/SUPPLIER specific link
  }
  const navItems = [...baseNav, ...roleNav];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-white/60 shadow-[0_25px_65px_-35px_rgba(15,79,172,0.65)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="text-2xl font-display font-semibold text-charcoal"
          >
            Agro<span className="text-primary">Connect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition ${
                    isActive
                      ? "text-primary after:scale-x-100"
                      : "text-gray-600 hover:text-primary hover:after:scale-x-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center rounded-full border border-primary/20 p-2 text-primary hover:bg-primary/5 transition"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-semibold rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Profile Icon */}
                <Link to={"/profile"}>
                  <UserCircleIcon className="w-10 h-10 text-primary" />
                </Link>

                {/* Name + Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Hi,{" "}
                    <span className="font-semibold">
                      {user?.first_name || user?.username}
                    </span>
                  </span>

                  {/* Heroicon Dropdown Arrow */}
                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-primary hover:text-primary-dark transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-primary text-white rounded-full px-4 py-2 hover:bg-primary-dark"
                >
                  Join Now
                </Link>
              </div>
            )}
            <button
              className="md:hidden border border-gray-200 rounded-full p-2"
              onClick={() => setOpen((prev) => !prev)}
            >
              <Bars3Icon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-2xl border ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "text-gray-600 border-transparent hover:bg-primary/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
