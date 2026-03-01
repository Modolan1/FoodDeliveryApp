import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const orderId = searchParams.get('order_id')
    if (sessionId && orderId) {
      axios
        .get(`${API_URL}/orders/confirm?session_id=${sessionId}&order_id=${orderId}`)
        .then((r) => {
          setOrder(r.data)
          clearCart()
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg mb-8">
          Thank you for your order! We're preparing your delicious food and will deliver it shortly.
        </p>
        {order && (
          <div className="card p-6 text-left mb-8">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">Order Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium text-xs text-gray-700 truncate ml-4">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="capitalize font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span className="font-bold text-primary-600">${order.total?.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-gray-500 text-sm font-medium mb-2">Items ordered:</p>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-primary px-8 py-3">Track Order</Link>
          <Link to="/menu" className="btn-secondary px-8 py-3">Order Again</Link>
        </div>
      </div>
    </div>
  )
}
