import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold text-white">FoodExpress</span>
          </div>
          <p className="text-sm">Delivering delicious food right to your doorstep. Fast, fresh, and always satisfying.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
            <li><Link to="/menu" className="hover:text-primary-400 transition-colors">Menu</Link></li>
            <li><Link to="/cart" className="hover:text-primary-400 transition-colors">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 support@foodexpress.com</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>📍 123 Food Street, NY 10001</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} FoodExpress. All rights reserved.
      </div>
    </footer>
  )
}
