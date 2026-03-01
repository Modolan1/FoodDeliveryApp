import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, foods: 0, categories: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/orders`),
      axios.get(`${API_URL}/foods`),
      axios.get(`${API_URL}/categories`),
    ])
      .then(([ordersRes, foodsRes, catRes]) => {
        const orders = ordersRes.data
        const revenue = orders.reduce((s, o) => s + (o.isPaid ? o.total : 0), 0)
        setStats({
          orders: orders.length,
          foods: foodsRes.data.length,
          categories: catRes.data.length,
          revenue,
        })
        setRecentOrders(orders.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Orders', value: stats.orders, icon: '📦', color: 'bg-blue-50 text-blue-700', link: '/admin/orders' },
          { label: 'Menu Items', value: stats.foods, icon: '🍽️', color: 'bg-orange-50 text-orange-700', link: '/admin/foods' },
          { label: 'Categories', value: stats.categories, icon: '🏷️', color: 'bg-purple-50 text-purple-700', link: '/admin/categories' },
          { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: '💰', color: 'bg-green-50 text-green-700', link: '/admin/orders' },
        ].map((stat) => (
          <Link key={stat.label} to={stat.link} className="card p-6 hover:shadow-lg transition-shadow">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${stat.color} mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Total</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono text-xs text-gray-600">{order._id.slice(-8)}</td>
                    <td className="py-3 px-3">{order.user?.name || 'N/A'}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">${order.total?.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`capitalize text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
