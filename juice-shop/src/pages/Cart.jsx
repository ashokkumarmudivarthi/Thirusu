import { useCart } from '../context/CartContext'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Cart({ onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  if (cartCount === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-12">
        <div className="bg-white rounded-[20px] max-w-md w-full p-12 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>

          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Add some delicious juices to get started!</p>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-[14px] hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-12">
      <div className="bg-white rounded-[16px] max-w-2xl w-full max-h-[84vh] overflow-hidden flex flex-col relative shadow-xl">
        {/* Inner Content Wrapper with Padding */}
        <div className="flex flex-col h-full px-6 py-8">
          {/* Header Section */}
          <div className="mb-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Shopping Cart</h2>
                <p className="text-sm text-gray-500">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors -mr-2"
              >
                <X size={22} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-7"></div>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6 mb-7">
            <div className="space-y-6">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-5 pb-6 border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-sm"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{item.name}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.short}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3.5 py-2 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-0.5 hover:bg-white rounded-full transition-colors"
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="w-7 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-0.5 hover:bg-white rounded-full transition-colors"
                        >
                          <Plus size={14} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-500">
                          ₹{Math.round(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 hover:bg-red-50 rounded-full transition-colors self-start -mr-2"
                    title="Remove from cart"
                  >
                    <X size={18} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal Section */}
          <div className="border-t border-gray-200 pt-6 mb-7">
            <div className="flex items-center justify-between mb-7">
              <span className="text-base font-medium text-gray-600">Subtotal</span>
              <span className="text-3xl font-bold text-gray-900">₹{Math.round(cartTotal)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleCheckout}
                className="w-4/5 py-3.5 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
              
              <button
                onClick={clearCart}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2"
              >
                Clear Cart
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-400 text-center mt-6">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
