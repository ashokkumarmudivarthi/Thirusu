import { X, ShoppingCart, Heart, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductDetail({ product, onClose, menuColor = '#FF6B35' }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || null) // Default to 500ml
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const isFavorite = isInWishlist(product.id)

  // Get current details based on selected size
  const currentPrice = selectedSize ? selectedSize.price : product.price
  const currentCalories = selectedSize ? selectedSize.calories : (product.calories || 120)
  const currentProtein = selectedSize ? selectedSize.protein : (product.protein || '3g')
  const currentSugar = selectedSize ? selectedSize.sugar : (product.sugar || '15g')
  const currentCarbs = selectedSize ? selectedSize.carbs : (product.carbs || '28g')
  const currentVitaminC = selectedSize ? selectedSize.vitaminC : (product.vitaminC || '80%')
  const currentServingSize = selectedSize ? selectedSize.servingSize : (product.servingSize || '350ml')
  const displayProduct = selectedSize ? { ...product, ...selectedSize, price: selectedSize.price } : product

  const handleAddToCart = () => {
    addToCart(displayProduct, quantity)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const handleToggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="sticky top-0 space-y-6">
              <div className="relative bg-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-96 w-auto object-contain"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Heart
                    size={24}
                    className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                  />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold" style={{ color: menuColor }}>
                    {currentCalories}
                  </div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold" style={{ color: menuColor }}>
                    {currentProtein}
                  </div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold" style={{ color: menuColor }}>
                    {currentSugar}
                  </div>
                  <div className="text-sm text-gray-600">Sugar</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Product Name & Category */}
            <div>
              <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3" style={{ backgroundColor: `${menuColor}20`, color: menuColor }}>
                {product.category}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.short}</p>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Choose Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((sizeOption, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(sizeOption)}
                      className={`p-4 rounded-xl text-center font-semibold transition-all duration-200 border-2 ${
                        selectedSize?.size === sizeOption.size
                          ? 'shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedSize?.size === sizeOption.size ? `${menuColor}15` : 'white',
                        borderColor: selectedSize?.size === sizeOption.size ? menuColor : undefined,
                      }}
                    >
                      <div className="text-xl font-bold" style={{ color: selectedSize?.size === sizeOption.size ? menuColor : '#1f2937' }}>
                        {sizeOption.size}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">₹{sizeOption.price}</div>
                      <div className="text-xs text-gray-500 mt-1">{sizeOption.calories} cal</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 border-t border-b py-4">
              <span className="text-4xl font-bold" style={{ color: menuColor }}>
                ₹{currentPrice}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ₹{Math.round(currentPrice * 1.2)}
              </span>
              <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Save {Math.round(((currentPrice * 1.2 - currentPrice) / (currentPrice * 1.2)) * 100)}%
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this product</h2>
              <p className="text-gray-700 leading-relaxed">{product.long}</p>
            </div>

            {/* Nutritional Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Nutritional Facts</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Serving Size</span>
                  <span>{currentServingSize}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Calories</span>
                  <span>{currentCalories} kcal</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Total Carbs</span>
                  <span>{currentCarbs}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Protein</span>
                  <span>{currentProtein}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold">Sugar</span>
                  <span>{currentSugar}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Vitamin C</span>
                  <span>{currentVitaminC}</span>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Ingredients</h2>
              <p className="text-gray-700">
                {product.ingredients || 'Fresh organic fruits, filtered water, natural preservatives'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-lg font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border-2 hover:bg-gray-100 transition-colors"
                  style={{ borderColor: `${menuColor}40` }}
                >
                  <Minus size={20} style={{ color: menuColor }} />
                </button>
                <span className="w-16 text-center font-bold text-2xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg border-2 hover:bg-gray-100 transition-colors"
                  style={{ borderColor: `${menuColor}40` }}
                >
                  <Plus size={20} style={{ color: menuColor }} />
                </button>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold animate-pulse">
                ✓ Added {quantity} {quantity > 1 ? 'items' : 'item'} to cart!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: menuColor }}
              >
                <ShoppingCart size={22} />
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-xl font-bold border-2 hover:bg-gray-50 transition-all duration-200"
                style={{ borderColor: menuColor, color: menuColor }}
              >
                Back
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Fresh & Cold-pressed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>No added sugar or preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Free delivery on orders above ₹4000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
