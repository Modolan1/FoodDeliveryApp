import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCategories from './pages/admin/Categories'
import AdminFoods from './pages/admin/Foods'
import AdminOrders from './pages/admin/Orders'

function AdminLayout({ children }) {
  const location = useLocation()
  const navItems = [
    { to: '/admin', label: '📊 Dashboard', exact: true },
    { to: '/admin/categories', label: '🏷️ Categories' },
    { to: '/admin/foods', label: '🍽️ Foods' },
    { to: '/admin/orders', label: '📦 Orders' },
  ]
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-gray-300 flex-shrink-0 min-h-screen">
        <div className="p-5 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-white font-bold">FoodExpress</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link to="/" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 mt-4">
            ← Back to Store
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
            <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
            <Route path="/order-success" element={<CustomerLayout><OrderSuccess /></CustomerLayout>} />
            <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
            <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <CustomerLayout><Orders /></CustomerLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminCategories /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/foods"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminFoods /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout><AdminOrders /></AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
