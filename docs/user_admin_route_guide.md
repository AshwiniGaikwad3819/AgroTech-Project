# Online Agro Store – User & Admin Guide + API Route List

## Setup

- Backend: copy `agro_backend/env.sample` to `.env` and set MySQL creds; environment loading uses `.env` with fallback to `env.sample` (agro_backend/settings.py:20–27).
- Migrate and create superuser: `..\.venv\Scripts\python manage.py migrate`, `..\.venv\Scripts\python manage.py createsuperuser`.
- Run server: `..\.venv\Scripts\python manage.py runserver`.
- Frontend: copy `frontend/env.sample` to `.env` and set `VITE_API_URL=http://localhost:8000/api`; start with `npm run dev`.

## Roles & Authentication

- Roles: `ADMIN`, `USER` (agro_backend/users/models.py:6–11).
- JWT login: `POST /api/auth/login/` with response including `username` and `role` claims (agro_backend/users/views.py:18–29).
- Refresh: `POST /api/auth/token/refresh/`.
- Register: `POST /api/auth/register/` (creates `USER`) (agro_backend/users/urls.py:10–16).
- Current user: `GET /api/auth/me/`, update via `PUT/PATCH /api/auth/me/` (agro_backend/users/views.py:36–46).
- Admin-only: `GET /api/auth/users/?role=ADMIN|USER` and `GET /api/auth/stats/` (agro_backend/users/views.py:49–58, 61–70; agro_backend/users/permissions.py:4–11).

## Admin Panel

- URL: `http://localhost:8000/admin/` (agro_backend/agro_backend/urls.py:21).
- Users: extended `UserAdmin` with profile fields and `role` (agro_backend/users/admin.py:7–30).
- Products: manage categories/products; filters and autocomplete (agro_backend/products/admin.py:6–17).
- Orders: manage orders with inline items and tracking (agro_backend/orders/admin.py:1–22).

## Backend API Routes

Base: `http://localhost:8000/api/` (agro_backend/agro_backend/urls.py:21–28)

### Auth (`/auth/`)

- `POST /register/` Create user
- `POST /login/` Obtain JWT pair
- `POST /token/refresh/` Refresh token
- `GET /me/` Get current user
- `PUT/PATCH /me/` Update profile
- `GET /users/?role=ADMIN|USER` Admin: list users
- `GET /stats/` Admin: counts for dashboard

### Products (`/products/`)

- `GET /` List active products; filters: `?type=INPUT|PRODUCE&category=<id>&owner=<id>` (agro_backend/products/views.py:22–39).
- `POST /` Admin-only create (agro_backend/products/serializers.py:52–63).
- `GET /:id/` Retrieve
- `PUT/PATCH /:id/` Owner or Admin (agro_backend/products/views.py:44–53).
- `DELETE /:id/` Owner or Admin (agro_backend/products/views.py:50–54).
- `GET /mine/` Auth: current user’s products (agro_backend/products/views.py:56–60).
- `GET /admin/all/` Admin: list all products (agro_backend/products/views.py:62–71).

### Categories (`/products/categories/`)

- `GET /` List categories
- `POST /` Create category
- `GET /:id/`, `PUT/PATCH /:id/`, `DELETE /:id/`

### Orders (`/orders/`)

- `GET /` List orders (Admin sees all; User sees own) (agro_backend/orders/views.py:18–33).
- `POST /` Create order (USER only) (agro_backend/orders/serializers.py:91–118).
- `GET /:id/`, `PUT/PATCH /:id/`, `DELETE /:id/` (ModelViewSet defaults).
- `POST /:id/accept/` Admin: set status to `IN_PROGRESS` (agro_backend/orders/views.py:40–50).
- `POST /:id/mark_completed/` Admin: set status to `COMPLETED` (agro_backend/orders/views.py:52–61).
- `POST /:id/tracking/` Admin: add status update note (agro_backend/orders/views.py:63–77).
- `GET /summary/` Aggregates totals and status breakdown (agro_backend/orders/views.py:79–94).

### Payments (`/payments/`)

- `GET /` List payments (Admin all; User own) (agro_backend/payments/views.py:8–16).
- `POST /` Create dummy PayPal payment for an order, marks order `PAID` and logs tracking (agro_backend/payments/serializers.py:21–47).
- `GET /:id/`, `PUT/PATCH /:id/`, `DELETE /:id/` (ModelViewSet defaults).

## Frontend Routes

- `/` Home (frontend/src/App.jsx:29)
- `/products` Listing (frontend/src/App.jsx:30)
- `/products/:id` Detail (frontend/src/App.jsx:31)
- `/cart` Cart (frontend/src/App.jsx:32)
- `/checkout` Checkout (frontend/src/App.jsx:33)
- `/orders` Protected (frontend/src/App.jsx:35–41)
- `/profile` Profile (frontend/src/App.jsx:42)
- `/admin` Admin-only dashboard (frontend/src/App.jsx:44–50)
- `/dashboard/seller` Admin-only seller dashboard (frontend/src/App.jsx:52–58)
- `/sell` Sell page (frontend/src/App.jsx:59)
- `/login`, `/register`, `*` NotFound (frontend/src/App.jsx:60–63)

## Common Flows

- Browse & purchase
  - Browse `/products`, add items; place order via `POST /api/orders/` with items, shipping, phone (agro_backend/orders/serializers.py:91–118).
  - Pay via `POST /api/payments/` with `order` id; backend sets `SUCCESS`, creates `reference`, marks order `PAID`, adds tracking (agro_backend/payments/serializers.py:30–47).
- Admin operations
  - Manage categories/products in admin UI; moderate `is_active`, `available_quantity` (agro_backend/products/models.py:30–47; admin.py:6–17).
  - Advance orders via `/accept/`, `/mark_completed/`, add tracking notes via `/tracking/` (agro_backend/orders/views.py:40–77).
  - Review metrics via `GET /api/auth/stats/` (agro_backend/users/views.py:61–70).

## Environment

- Key vars: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ORIGINS`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT` (agro_backend/env.sample:1–10).
- Media served under `/media/` (agro_backend/settings.py:143–150; agro_backend/agro_backend/urls.py:28).
