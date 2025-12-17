import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, MapPin, CreditCard, Check } from 'lucide-react'
import TopScroll from '../sections/TopScroll'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [showCart, setShowCart] = useState(false)

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  }
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits'
    }
    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Format: MM/YY'
    }
    if (!formData.cardCVV.trim()) {
      newErrors.cardCVV = 'CVV is required'
    } else if (!/^\d{3}$/.test(formData.cardCVV)) {
      newErrors.cardCVV = 'CVV must be 3 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const orderDetails = {
        orderNumber: `ORD-${Date.now()}`,
        items: cartItems,
        total: cartTotal,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        },
        orderDate: new Date().toLocaleDateString(),
      }

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('thirusu-orders') || '[]')
      existingOrders.push(orderDetails)
      localStorage.setItem('thirusu-orders', JSON.stringify(existingOrders))

      clearCart()
      navigate('/order-confirmation', { state: orderDetails })
    }, 2000)
  }

  const shippingFee = cartTotal > 4000 ? 0 : 99
  const tax = cartTotal * 0.08
  const finalTotal = cartTotal + shippingFee + tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar
          activePrimary="Shop"
          onPrimaryChange={() => {}}
          onMenuHover={() => {}}
          onLogoClick={() => navigate('/')}
          menuColors={menuColors}
          currentMenuColor="#FF6B35"
          showLeftList={true}
          onCartClick={() => setShowCart(true)}
        />
      </header>

      <div className="py-0 px-0" style={{ paddingTop: '160px' }}>
      <div className="max-w-full mx-auto">
        {/* Header - Full Width */}
        <div className="bg-white border-b border-gray-200 py-6 px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">
              Checkout
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Side - Form */}
            <div className="bg-white p-8 lg:p-12 overflow-y-auto">
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
                {/* Contact */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Delivery */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Delivery</h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="First name"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Address"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Postcode"
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="State"
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Phone"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Card number"
                        maxLength="19"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Expiration date (MM / YY)"
                          maxLength="5"
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.cardCVV ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Security code"
                          maxLength="3"
                        />
                        {errors.cardCVV && <p className="text-red-500 text-xs mt-1">{errors.cardCVV}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-lg font-bold text-white text-base transition-all ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay now - $${finalTotal.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>            {/* Right Side - Order Summary */}
            <div className="bg-gray-50 p-8 lg:p-12 border-l border-gray-200">
              <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{Math.round(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? 'FREE' : `₹${Math.round(shippingFee)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Tax (8%)</span>
                    <span className="font-medium">₹{Math.round(tax)}</span>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">₹{Math.round(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Secure Message */}
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Check size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-green-800">Secure Checkout</p>
                      <p className="text-xs text-green-700 mt-1">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
