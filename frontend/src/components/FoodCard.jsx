import { useCart } from '../context/CartContext'

export default function FoodCard({ food }) {
  const { addToCart } = useCart()

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden h-48">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Food' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        {!food.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{food.name}</h3>
          <span className="text-primary-600 font-bold text-lg ml-2 whitespace-nowrap">
            ${food.price.toFixed(2)}
          </span>
        </div>
        {food.description && (
          <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{food.description}</p>
        )}
        {food.category?.name && (
          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
            {food.category.name}
          </span>
        )}
        <button
          onClick={() => addToCart(food)}
          disabled={!food.available}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
          {food.available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
