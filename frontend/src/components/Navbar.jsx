import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold text-primary-600">FoodExpress</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Menu</Link>
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">My Orders</Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Admin</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 6M17 13l1.4 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-primary text-sm py-1.5 px-3">Logout</button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            )}

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t py-3 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/menu" className="block px-4 py-2 text-gray-700 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Menu</Link>
            {user && <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>My Orders</Link>}
            {user?.isAdmin && <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Admin</Link>}
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
