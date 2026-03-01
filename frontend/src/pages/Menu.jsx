import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import FoodCard from '../components/FoodCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Menu() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const selectedCategory = searchParams.get('category') || ''

  useEffect(() => {
    axios.get(`${API_URL}/categories`).then((r) => setCategories(r.data)).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ available: 'true' })
    if (selectedCategory) params.set('category', selectedCategory)
    axios
      .get(`${API_URL}/foods?${params}`)
      .then((r) => setFoods(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCategory])

  const filtered = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCategorySelect = (id) => {
    if (id) setSearchParams({ category: id })
    else setSearchParams({})
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
        <p className="text-gray-500">Explore our delicious selection of dishes</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => handleCategorySelect('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategorySelect(cat._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat._id
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-xl text-gray-500">No food items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  )
}
