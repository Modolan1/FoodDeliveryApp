import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const fetchOrders = () => {
    axios.get(`${API_URL}/orders`).then((r) => setOrders(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      await axios.put(`${API_URL}/orders/${id}/status`, { status })
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <span className="text-gray-500 text-sm">{orders.length} total orders</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterStatus ? 'bg-primary-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
        >All</button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-primary-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >{s.replace('_', ' ')}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order._id} className="card overflow-hidden">
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div>
                    <p className="font-mono text-xs text-gray-500">#{order._id.slice(-8)}</p>
                    <p className="font-semibold text-gray-900">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </div>
                  <div className="sm:ml-4">
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    <p className="font-bold text-primary-600">${order.total?.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`capitalize text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(order._id, e.target.value) }}
                    disabled={updatingId === order._id}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  {updatingId === order._id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  )}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order._id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedId === order._id && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.name} × {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.address && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Delivery Address</h4>
                        <p className="text-sm text-gray-600">{order.address.street}</p>
                        <p className="text-sm text-gray-600">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                        <p className="text-sm text-gray-600">{order.address.country}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-gray-500">
                    <span>Payment: <span className={order.isPaid ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></span>
                    {order.stripePaymentId && <span>Stripe ID: {order.stripePaymentId.slice(-12)}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
