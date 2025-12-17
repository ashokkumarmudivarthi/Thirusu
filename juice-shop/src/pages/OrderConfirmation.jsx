import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, Truck, MapPin, Mail, Phone, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopScroll from '../sections/TopScroll'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderDetails = location.state
  const [showCart, setShowCart] = useState(false)

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  }

  useEffect(() => {
    // Redirect to home if no order details
    if (!orderDetails) {
      navigate('/')
    }
  }, [orderDetails, navigate])

  if (!orderDetails) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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

      <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center" style={{ paddingTop: '220px', paddingBottom: '80px' }}>
      <div className="max-w-4xl w-full">
        {/* Success Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-green-100 rounded-full mb-8 animate-bounce shadow-lg">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h1 className="text-6xl font-bold mb-4 text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-3">
            Thank you for your order, {orderDetails.customer.name}
          </p>
          <p className="text-lg text-gray-500">
            Order Number: <span className="font-bold text-orange-600 text-2xl">{orderDetails.orderNumber}</span>
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Order Status</h2>
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={24} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-green-600">Order Placed</p>
              <p className="text-xs text-gray-500">{orderDetails.orderDate}</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <Package size={24} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-orange-600">Processing</p>
              <p className="text-xs text-gray-500">1-2 days</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <Truck size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-400">Shipping</p>
              <p className="text-xs text-gray-500">3-5 days</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📧 <strong>Confirmation email sent!</strong> Check your inbox at <span className="font-semibold">{orderDetails.customer.email}</span> for order details and tracking information.
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin size={24} className="text-orange-500" />
              Shipping Address
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{orderDetails.customer.name}</p>
              <p>{orderDetails.customer.address}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail size={24} className="text-orange-500" />
              Contact Information
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-gray-400" />
                <span>{orderDetails.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-gray-400" />
                <span>{orderDetails.customer.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">Order Items</h3>
          <div className="space-y-4">
            {orderDetails.items.map(item => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">₹{Math.round(item.price * item.quantity)}</p>
                  <p className="text-xs text-gray-500">₹{item.price} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Paid:</span>
              <span className="text-2xl text-orange-600">₹{Math.round(orderDetails.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Home size={24} />
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-4 px-6 border-2 border-orange-500 text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all"
          >
            Print Receipt
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Need help with your order?</p>
          <p className="text-sm">
            Contact us at{' '}
            <a href="mailto:support@thirusu.com" className="text-orange-600 font-semibold hover:underline">
              support@thirusu.com
            </a>{' '}
            or call{' '}
            <a href="tel:1-800-THIRUSU" className="text-orange-600 font-semibold hover:underline">
              1-800-THIRUSU
            </a>
          </p>
        </div>
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
