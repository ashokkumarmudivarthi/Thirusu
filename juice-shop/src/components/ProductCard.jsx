import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, menuColor = '#FF6B35' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const isFavorite = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
    setQuantity(1)
  }

  const handleToggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
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

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold" style={{ color: menuColor }}>
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{Math.round(product.price * 1.2)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-semibold text-gray-700">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-md border-2 hover:bg-gray-100 transition-colors"
              style={{ borderColor: menuColor + '40' }}
            >
              <Minus size={16} style={{ color: menuColor }} />
            </button>
            <span className="w-10 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-md border-2 hover:bg-gray-100 transition-colors"
              style={{ borderColor: menuColor + '40' }}
            >
              <Plus size={16} style={{ color: menuColor }} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-3 p-2 bg-green-100 text-green-800 text-sm rounded-lg text-center font-semibold animate-pulse">
            ✓ Added to cart!
          </div>
        )}

        {/* Dynamic Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 transform overflow-hidden group/btn relative flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          style={{ backgroundColor: menuColor }}
        >
          {/* Animated background */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></span>
          
          {/* Button content */}
          <span className="relative flex items-center gap-2">
            <ShoppingCart size={18} />
            {isHovered ? 'Add to Cart' : 'Shop Now'}
          </span>

          {/* Animated border glow */}
          <span className="absolute inset-0 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" style={{ boxShadow: `inset 0 0 0 2px ${menuColor}, 0 0 20px ${menuColor}40` }}></span>
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