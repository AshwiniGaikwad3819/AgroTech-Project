# Online Agro Store – Full Documentation

This repository contains a complete web application for an Online Agro Store, built with **Django REST Framework + MySQL** on the backend and **React + Tailwind CSS + Redux Toolkit** on the frontend. It enables farmers, suppliers, customers, and admins to transact digitally with transparent pricing, direct marketplace access, and a dummy payment flow.

---

## 1. System Overview

### Modules Implemented

| Module   | Key Features |
|----------|--------------|
| Admin    | Manage users, approve suppliers, moderate products, view stats |
| Farmer   | List produce, track orders, manage profile, view payouts |
| Supplier | List input supplies, manage inventory & orders, requires admin approval |
| Customer | Browse marketplace, manage cart, checkout via dummy PayPal, view order history |
| Payment  | Dummy PayPal provider, records transactions, marks orders as PAID |

All requirements from the original spec (Existing System, Proposed System, Need, Scope, Module Specification, Hardware/Software) are reflected in the architecture, endpoints, and UI flows.

---

## 2. Local Development Setup

### Prerequisites
- Python 3.12+ (virtual environment recommended)
- Node.js 18+ with npm
- MySQL 8 (or compatible) running locally

### Backend Setup
```powershell
cd C:\Users\pawar\OneDrive\Desktop\Django
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

1. Copy `agro_backend/env.sample` to `.env` and update with your DB credentials.
2. Run migrations and create superuser:
   ```powershell
   cd agro_backend
   ..\.venv\Scripts\python manage.py migrate
   ..\.venv\Scripts\python manage.py createsuperuser
   ```
3. Start backend server:
   ```powershell
   ..\.venv\Scripts\python manage.py runserver
   ```

### Frontend Setup
```powershell
cd C:\Users\pawar\OneDrive\Desktop\Django\frontend
npm install
```

1. Copy `frontend/env.sample` to `.env` and ensure `VITE_API_URL=http://localhost:8000/api`.
2. Start Vite dev server:
   ```powershell
   npm run dev
   ```
3. Open the URL printed by Vite (default `http://localhost:5173/`).

---

## 3. API Endpoints (Summary)

Base URL: `http://localhost:8000/api/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register/` | POST | Create user (farmer/supplier/customer) |
| `/auth/login/` | POST | JWT token (SimpleJWT) |
| `/auth/token/refresh/` | POST | Refresh token |
| `/auth/me/` | GET/PUT | Profile view/update |
| `/auth/users/?role=` | GET | Admin: list users by role |
| `/auth/suppliers/<id>/approval/` | PATCH | Admin: approve supplier |
| `/auth/stats/` | GET | Admin dashboard metrics |
| `/products/` | GET/POST | List or create products (role-based restrictions) |
| `/products/<id>/` | GET/PUT/DELETE | Product detail |
| `/products/categories/` | GET/POST | Manage categories |
| `/products/admin/all/` | GET | Admin view of all products |
| `/orders/` | GET/POST | Buyer order history, create orders |
| `/orders/<id>/mark_completed/` | POST | Supplier/Admin mark completed |
| `/orders/summary/` | GET | Aggregate totals |
| `/payments/` | POST/GET | Dummy PayPal payment + history |

All endpoints require JWT `Authorization: Bearer <token>` except registration/login and product browsing.

---

## 4. Frontend Architecture

- **State Management**: Redux Toolkit slices (`auth`, `cart`, `products`)
- **Routing**: React Router 6, with `ProtectedRoute` for auth/role guarding
- **UI Components**: Navbar, Hero, ProductCard, Footer, etc.
- **Pages**:
  - `Home`: hero, categories, featured products, modernization pitch
  - `Products`: advanced filters, grid
  - `ProductDetail`: quantity + add-to-cart
  - `Cart`: Redux cart management
  - `Checkout`: address form + dummy PayPal trigger
  - `Orders`: role-based order list
  - `Profile`: update personal info
  - `AdminDashboard`: stats + recent listings
  - `Sell`: module specification info
  - `Login/Register`, `NotFound`

---

## 5. Role-Based User Guides

### Farmer
1. Register as `FARMER`.
2. Admin verifies profile (optional).
3. Add produce via admin/API (UI extension planned).
4. Monitor orders in `Orders` page (items where farmer is the product owner).

### Supplier
1. Register as `SUPPLIER`.
2. Wait for admin approval (`is_supplier_approved`).
3. List inputs; manage inventory via admin/API.
4. View orders for supplied items; mark completed if needed.

### Customer
1. Register or browse before login.
2. Add items to cart (farmer or supplier products).
3. Checkout with dummy PayPal → order marked PAID.
4. View history in `Orders`.

### Admin
1. Sign in via Django admin.
2. Approve suppliers, verify farmers.
3. Manage categories/products/orders/payments.
4. Use `/admin` frontend dashboard for quick stats.

---

## 6. Dummy Payment Flow
1. Checkout POST `/api/orders/` captures cart, shipping, contact info.
2. Frontend immediately POSTs `/api/payments/` with `order` id + provider = PAYPAL.
3. Backend sets `Payment.status = SUCCESS`, `order.status = PAID`, generates reference like `DUMMY-AB12CD34`.
4. Cart clears, user redirected to Orders page.

---

## 7. Testing Checklist

1. **Auth**: Register, login, refresh token, profile update.
2. **Supplier Approval**: Admin approves via Django admin or API.
3. **Catalog**: Create categories, add products with both roles.
4. **Cart**: Add/remove/update quantities, ensure persistence.
5. **Checkout**: Place order, verify order + payment records.
6. **Orders Page**: Buyer sees history; supplier sees relevant orders; admin sees all.
7. **Dashboard**: Ensure stats reflect real counts.
8. **Payment Module**: Confirm dummy payments logged.

---

## 8. Future Enhancements
- Real payment gateways (UPI/PayPal/Stripe).
- Delivery tracking & logistics integration.
- Messaging between farmers/buyers.
- Mobile app using same API.
- Reporting & analytics dashboards with charts.

---

## 9. Troubleshooting
- **MySQL Connection**: Ensure credentials in `.env` are correct; DB exists.
- **Pillow/Media**: Install `Pillow`; run `collectstatic` for production.
- **CORS/Auth Issues**: Update `DJANGO_ALLOWED_HOSTS` and `DJANGO_CORS_ORIGINS`.
- **Vite Port Conflict**: If 5173 busy, Vite auto-selects next port; update frontend URL accordingly.

---

## 10. License / Usage
This project is intended for educational or internal demo purposes. Replace dummy payment logic and hard-coded secrets before deploying to production.

---

Happy farming & selling! 🌾






