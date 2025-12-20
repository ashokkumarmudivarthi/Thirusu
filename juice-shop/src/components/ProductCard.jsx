import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, menuColor = '#FF6B35', onProductClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || null) // Default to 500ml (middle option)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const isFavorite = isInWishlist(product.id)

  // Get current price and details based on selected size
  const currentPrice = selectedSize ? selectedSize.price : product.price
  const displayProduct = selectedSize ? { ...product, ...selectedSize, price: selectedSize.price } : product

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(displayProduct, quantity)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
    setQuantity(1)
  }

  const handleToggleWishlist = (e) => {
    e.stopPropagation()
    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <div className="relative h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-auto max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-all duration-200 shadow-md"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Stock Badge */}
        {selectedSize && (
          <div className="absolute top-4 left-4">
            {selectedSize.inStock ? (
              <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-md">
                ✓ In Stock
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                Out of Stock
              </span>
            )}
          </div>
        )}

        {/* Animated Badge */}
        <div 
          className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur font-bold text-sm shadow-md transform translate-y-12 group-hover:translate-y-0 transition-transform duration-300"
          style={{ color: menuColor }}
        >
          ✨ Premium
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-textdark mb-2 group-hover:text-[--menu-color] transition-colors line-clamp-2"
          style={{ '--menu-color': menuColor }}
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {product.short}
        </p>

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Size:</p>
            <div className="flex gap-2">
              {product.sizes.map((sizeOption, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSize(sizeOption)
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    selectedSize?.size === sizeOption.size
                      ? 'ring-2 shadow-md scale-105'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedSize?.size === sizeOption.size ? `${menuColor}20` : undefined,
                    color: selectedSize?.size === sizeOption.size ? menuColor : undefined,
                    ringColor: selectedSize?.size === sizeOption.size ? menuColor : undefined,
                  }}
                >
                  {sizeOption.size}
                </button>
              ))}
            </div>
            {/* Calories Info */}
            {selectedSize && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <span>🔥 {selectedSize.calories} cal</span>
                <span>•</span>
                <span>💪 {selectedSize.protein}</span>
              </div>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold" style={{ color: menuColor }}>
            ₹{currentPrice}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{Math.round(currentPrice * 1.2)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-semibold text-gray-700">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setQuantity(Math.max(1, quantity - 1))
              }}
              disabled={!selectedSize?.inStock}
              className={`p-1 rounded-md border-2 transition-colors ${
                !selectedSize?.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              style={{ borderColor: menuColor + '40' }}
            >
              <Minus size={16} style={{ color: menuColor }} />
            </button>
            <span className="w-10 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setQuantity(quantity + 1)
              }}
              disabled={!selectedSize?.inStock}
              className={`p-1 rounded-md border-2 transition-colors ${
                !selectedSize?.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              style={{ borderColor: menuColor + '40' }}
            >
              <Plus size={16} style={{ color: menuColor }} />
            </button>
          </div>
        </div>

        {/* Stock Warning */}
        {selectedSize && !selectedSize.inStock && (
          <div className="mb-3 p-2 bg-red-100 text-red-800 text-sm rounded-lg text-center font-semibold">
            ⚠️ Currently out of stock
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-3 p-2 bg-green-100 text-green-800 text-sm rounded-lg text-center font-semibold animate-pulse">
            ✓ Added to cart!
          </div>
        )}

        {/* Dynamic Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize?.inStock}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 transform overflow-hidden group/btn relative flex items-center justify-center gap-2 ${
            selectedSize?.inStock 
              ? 'hover:scale-105 active:scale-95' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ backgroundColor: selectedSize?.inStock ? menuColor : '#9CA3AF' }}
        >
          {/* Animated background */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></span>
          
          {/* Button content */}
          <span className="relative flex items-center gap-2">
            <ShoppingCart size={18} />
            {!selectedSize?.inStock ? 'Out of Stock' : isHovered ? 'Add to Cart' : 'Shop Now'}
          </span>

          {/* Animated border glow */}
          {selectedSize?.inStock && (
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" style={{ boxShadow: `inset 0 0 0 2px ${menuColor}, 0 0 20px ${menuColor}40` }}></span>
          )}
        </button>

        {/* Comparison Link */}
        <button className="w-full mt-3 py-2 text-sm font-semibold transition-all duration-200 rounded-lg border-2 border-gray-200 hover:border-gray-400 text-textdark hover:bg-gray-50"
          style={{ borderColor: menuColor + '40' }}
        >
          Compare
        </button>
      </div>

      {/* Animated corner accent */}
      <div 
        className="absolute top-0 right-0 w-0 h-0 border-l-[100px] border-b-[100px] transition-all duration-300 group-hover:border-l-[120px] group-hover:border-b-[120px]"
        style={{ borderLeftColor: 'transparent', borderBottomColor: menuColor + '15' }}
      ></div>
    </div>
  )
}