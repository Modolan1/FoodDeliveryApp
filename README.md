# FoodDeliveryApp

A full-stack food delivery ecommerce web application with an admin dashboard and Stripe payment integration.

## Features

### Customer Storefront
- 🏠 **Home page** – Hero section, featured categories, and featured food items
- 🍽️ **Menu page** – Browse all foods, filter by category, and search
- 🛒 **Cart** – Add/remove items, update quantities, persisted in localStorage
- 💳 **Checkout** – Enter delivery address, then pay securely via Stripe
- ✅ **Order confirmation** – See order details after successful payment
- 📦 **My Orders** – Track all your past orders and their statuses
- 🔐 **Auth** – Register and login with JWT-based authentication

### Admin Dashboard
- 📊 **Dashboard** – Overview of total orders, menu items, categories, and revenue
- 🏷️ **Categories** – Create, edit, and delete food categories (with image URL)
- 🍔 **Foods** – Create, edit, and delete food items with price, category, and availability
- 📦 **Orders** – View all customer orders, update order status

### Payments
- Stripe Checkout Sessions (hosted payment page)
- Webhook to confirm payment and update order status automatically

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| Payments | Stripe Checkout Sessions |
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Stripe account](https://stripe.com) (free test keys)

### 1. Clone the repository
```bash
git clone https://github.com/Modolan1/FoodDeliveryApp.git
cd FoodDeliveryApp
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in:
```env
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_super_secret_key
STRIPE_SECRET_KEY=sk_test_...          # from Stripe Dashboard → Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...        # from Stripe CLI: stripe listen --print-secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

Install dependencies and start:
```bash
npm install
npm run dev        # uses nodemon for auto-reload
# or
npm start          # production
```

### 3. Set up the frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # from Stripe Dashboard → Developers → API keys
```

Install dependencies and start:
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Create an admin user

Register normally via the app, then update the user in MongoDB:
```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "admin@example.com" }, { $set: { isAdmin: true } })
```

### 5. Stripe Webhooks (for local development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events:
```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/categories` | Public | List all categories |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |
| GET | `/api/foods` | Public | List all foods (supports `?category=` and `?available=true`) |
| POST | `/api/foods` | Admin | Create food item |
| PUT | `/api/foods/:id` | Admin | Update food item |
| DELETE | `/api/foods/:id` | Admin | Delete food item |
| POST | `/api/orders` | Auth | Create order + Stripe Checkout Session |
| GET | `/api/orders/myorders` | Auth | Get current user's orders |
| GET | `/api/orders/confirm` | Auth | Confirm payment after redirect |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| POST | `/api/orders/webhook` | Stripe | Stripe payment webhook |

---

## Project Structure

```
FoodDeliveryApp/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route handler logic
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── foodController.js
│   │   └── orderController.js
│   ├── middleware/auth.js         # JWT protect + admin check
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Food.js
│   │   └── Order.js
│   ├── routes/                    # Express routes
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── foods.js
│   │   └── orders.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── FoodCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx    # JWT auth state
    │   │   └── CartContext.jsx    # Shopping cart state
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Menu.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx       # Stripe redirect
    │   │   ├── OrderSuccess.jsx
    │   │   ├── Orders.jsx         # My orders
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Categories.jsx
    │   │       ├── Foods.jsx
    │   │       └── Orders.jsx
    │   ├── App.jsx                # Routes setup
    │   └── main.jsx
    ├── tailwind.config.js
    └── .env.example
```