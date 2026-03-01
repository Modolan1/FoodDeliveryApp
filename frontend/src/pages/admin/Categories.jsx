import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const emptyForm = { name: '', description: '', image: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = () => {
    axios.get(`${API_URL}/categories`).then((r) => setCategories(r.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editId) {
        await axios.put(`${API_URL}/categories/${editId}`, form)
      } else {
        await axios.post(`${API_URL}/categories`, form)
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditId(null)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description, image: cat.image })
    setEditId(cat._id)
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await axios.delete(`${API_URL}/categories/${id}`)
      fetchCategories()
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setError('') }}
          className="btn-primary flex items-center gap-2"
        >
          <span>+</span> Add Category
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editId ? 'Edit Category' : 'New Category'}</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://example.com/image.jpg" />
            </div>
            {form.image && (
              <img src={form.image} alt="preview" className="w-24 h-24 object-cover rounded-lg border"
                onError={(e) => { e.target.style.display = 'none' }} />
            )}
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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No categories yet. Add one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="card p-4 flex gap-4 items-start">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=?' }} />
              ) : (
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏷️</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{cat.name}</h3>
                {cat.description && <p className="text-sm text-gray-500 truncate mt-1">{cat.description}</p>}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
