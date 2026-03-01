import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const emptyForm = { name: '', description: '', price: '', image: '', category: '', available: true }

export default function AdminFoods() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const fetchFoods = () => {
    axios.get(`${API_URL}/foods`).then((r) => setFoods(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    axios.get(`${API_URL}/categories`).then((r) => setCategories(r.data)).catch(console.error)
    fetchFoods()
  }, [])

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [e.target.name]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      if (editId) {
        await axios.put(`${API_URL}/foods/${editId}`, payload)
      } else {
        await axios.post(`${API_URL}/foods`, payload)
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditId(null)
      fetchFoods()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save food item')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (food) => {
    setForm({
      name: food.name,
      description: food.description || '',
      price: food.price.toString(),
      image: food.image || '',
      category: food.category?._id || food.category || '',
      available: food.available,
    })
    setEditId(food._id)
    setShowForm(true)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return
    try {
      await axios.delete(`${API_URL}/foods/${id}`)
      fetchFoods()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setForm(emptyForm)
    setEditId(null)
    setError('')
  }

  const filtered = filterCat ? foods.filter((f) => (f.category?._id || f.category) === filterCat) : foods

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Food Items</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setError('') }}
          className="btn-primary flex items-center gap-2"
        >
          <span>+</span> Add Food
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editId ? 'Edit Food Item' : 'New Food Item'}</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" step="0.01" min="0" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://example.com/food.jpg" />
            </div>
            {form.image && (
              <img src={form.image} alt="preview" className="w-32 h-24 object-cover rounded-lg border"
                onError={(e) => { e.target.style.display = 'none' }} />
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" name="available" id="available" checked={form.available} onChange={handleChange} className="w-4 h-4 accent-primary-500" />
              <label htmlFor="available" className="text-sm font-medium text-gray-700">Available</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : null}
                {editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilterCat('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!filterCat ? 'bg-primary-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
        >All</button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setFilterCat(c._id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterCat === c._id ? 'bg-primary-500 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >{c.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No food items found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Item</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((food) => (
                <tr key={food._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {food.image ? (
                        <img src={food.image} alt={food.name} className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=?' }} />
                      ) : (
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">🍽️</div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{food.name}</p>
                        {food.description && <p className="text-xs text-gray-500 truncate max-w-xs">{food.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{food.category?.name || '—'}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">${food.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${food.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {food.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEdit(food)} className="text-blue-600 hover:text-blue-800 font-medium mr-4">Edit</button>
                    <button onClick={() => handleDelete(food._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
