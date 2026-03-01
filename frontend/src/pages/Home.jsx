import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import FoodCard from '../components/FoodCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featuredFoods, setFeaturedFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, foodRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/foods?available=true`),
        ])
        setCategories(catRes.data.slice(0, 6))
        setFeaturedFoods(foodRes.data.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Delicious Food,<br />
              <span className="text-yellow-300">Delivered Fast</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100">
              Order from the best restaurants near you. Fresh ingredients, amazing taste.
            </p>
            <Link
              to="/menu"
              className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 hover:text-primary-800 transition-all duration-200 text-lg shadow-lg"
            >
              Order Now 🚀
            </Link>
          </div>
          <div className="flex-1 text-center text-[10rem] md:text-[14rem] leading-none select-none">
            🍔
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '⚡', title: 'Fast Delivery', desc: 'Get your food in 30 minutes or less' },
            { icon: '🌿', title: 'Fresh Ingredients', desc: 'All dishes made with fresh, quality ingredients' },
            { icon: '💳', title: 'Secure Payment', desc: 'Pay safely with Stripe-powered checkout' },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl bg-primary-50 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-14 max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <Link to="/menu" className="text-primary-600 hover:text-primary-700 font-semibold">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/menu?category=${cat._id}`}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow hover:shadow-md hover:border-primary-300 border border-transparent transition-all group"
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-full mb-2 group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                    🍽️
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Foods */}
      {!loading && featuredFoods.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Items</h2>
              <Link to="/menu" className="text-primary-600 hover:text-primary-700 font-semibold">See All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  )
}
