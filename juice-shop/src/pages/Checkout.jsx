import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, MapPin, CreditCard, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import emailjs from '@emailjs/browser'
import TopScroll from '../sections/TopScroll'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LocationPicker from '../components/LocationPicker'
import { ordersAPI } from '../services/api'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showCart, setShowCart] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Address, 2: Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('') // paypal, paytm, googlepay, netbanking, card

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
    latitude: null,
    longitude: null,
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: '',
    netBankingBank: '',
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  // Initialize map location to Chennai by default
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }))
        },
        () => {
          // Default to Chennai if geolocation fails
          setFormData(prev => ({
            ...prev,
            latitude: 13.0827,
            longitude: 80.2707
          }))
        }
      )
    } else {
      // Default to Chennai
      setFormData(prev => ({
        ...prev,
        latitude: 13.0827,
        longitude: 80.2707
      }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateAddressStep = () => {
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaymentStep = () => {
    const newErrors = {}

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    if (selectedPaymentMethod === 'card') {
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
    }

    if (selectedPaymentMethod === 'upi' && !formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required'
    }

    if (selectedPaymentMethod === 'netbanking' && !formData.netBankingBank.trim()) {
      newErrors.netBankingBank = 'Please select a bank'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateAddressStep()) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePaymentStep()) {
      return
    }

    setIsProcessing(true)

    try {
      // Prepare order items for backend
      const orderItems = cartItems.map(item => {
        // Get the size ID - could be from selectedSize or the item itself
        const sizeId = item.selectedSize?.id || item.id;
        const size = item.selectedSize?.size || item.size || '250ml';
        const price = item.selectedSize?.price || item.price;
        
        return {
          productSizeId: sizeId,
          productName: item.name,
          size: size,
          quantity: item.quantity,
          price: parseFloat(price)
        };
      });

      // Calculate totals
      const shippingFee = cartTotal > 4000 ? 0 : 99
      const discount = appliedCoupon ? appliedCoupon.discount_amount : 0
      const subtotalAfterDiscount = cartTotal - discount
      const tax = subtotalAfterDiscount * 0.08
      const finalTotal = subtotalAfterDiscount + shippingFee + tax

      // Create order in backend (this will deduct stock automatically)
      const orderData = {
        items: orderItems,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        totalAmount: finalTotal,
        paymentMethod: selectedPaymentMethod || 'cod',
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        latitude: formData.latitude,
        longitude: formData.longitude,
        notes: ''
      }

      const response = await ordersAPI.create(orderData)

      // Prepare order details for confirmation page
      const orderDetails = {
        orderNumber: response.order.order_number,
        orderId: response.order.id,
        items: cartItems,
        total: cartTotal,
        shippingFee,
        tax,
        finalTotal,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        },
        orderDate: new Date(response.order.created_at).toLocaleDateString(),
        status: response.order.status
      }

      // Send order confirmation email via EmailJS
      try {
        // Format order items for email template (matching EmailJS template structure)
        const ordersForEmail = cartItems.map(item => ({
          name: item.name,
          units: item.quantity,
          price: (item.price * item.quantity).toFixed(2),
          image_url: item.image || 'https://via.placeholder.com/64'
        }));

        await emailjs.send(
          'service_ie2l1kg',    // Your EmailJS Service ID
          'template_t67u4rg',   // Order Confirmation Template ID
          {
            email: formData.email,
            to_email: formData.email,
            customer_name: formData.fullName,
            order_id: response.order.order_number,
            order_number: response.order.order_number,
            order_date: new Date(response.order.created_at).toLocaleDateString(),
            order_status: response.order.status,
            orders: ordersForEmail,
            cost: {
              shipping: shippingFee.toFixed(2),
              tax: tax.toFixed(2),
              total: finalTotal.toFixed(2)
            },
            subtotal: cartTotal.toFixed(2),
            shipping_fee: shippingFee.toFixed(2),
            tax: tax.toFixed(2),
            total_amount: finalTotal.toFixed(2),
            delivery_address: `${formData.fullName}\n${formData.phone}\n${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
            payment_method: selectedPaymentMethod || 'Cash on Delivery'
          },
          '_wCy461WHzxRVNDAm'   // Your EmailJS Public Key
        );
        
        console.log('✅ Order confirmation email sent successfully!');
      } catch (emailError) {
        console.error('❌ Failed to send order confirmation email:', emailError);
        // Don't block order completion if email fails
      }

      clearCart()
      navigate('/order-confirmation', { state: orderDetails })
    } catch (error) {
      console.error('Order creation failed:', error)
      
      // Check for specific error messages
      if (error.response?.data?.error) {
        alert(`Order failed: ${error.response.data.error}`)
      } else if (error.response?.status === 401) {
        alert('Please login to place an order')
        navigate('/login')
      } else {
        alert('Failed to place order. Please try again.')
      }
      
      setIsProcessing(false)
    }
  }

  // Apply coupon discount
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    
    setCouponLoading(true)
    setCouponError('')
    
    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderValue: cartTotal })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAppliedCoupon(data.coupon)
        setCouponError('')
      } else {
        setCouponError(data.error || 'Invalid coupon code')
        setAppliedCoupon(null)
      }
    } catch (error) {
      setCouponError('Failed to apply coupon')
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }
  
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const shippingFee = cartTotal > 4000 ? 0 : 99
  const discount = appliedCoupon ? appliedCoupon.discount_amount : 0
  const subtotalAfterDiscount = cartTotal - discount
  const tax = subtotalAfterDiscount * 0.08
  const finalTotal = subtotalAfterDiscount + shippingFee + tax

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
              {/* Step Indicator */}
              <div className="max-w-xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      1
                    </div>
                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                      <div className={`h-full ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className={`text-sm ${currentStep >= 1 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                    Delivery Address
                  </span>
                  <span className={`text-sm ${currentStep >= 2 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                    Payment
                  </span>
                </div>
              </div>

              <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="max-w-xl mx-auto space-y-8">
                {/* Step 1: Address & Contact */}
                {currentStep === 1 && (
                  <>
                    {/* Contact */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your name"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name (Optional)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your street address"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter city"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter postcode"
                        />
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter state"
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Location Picker with Map */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Pin your exact location</h3>
                      <LocationPicker 
                        onLocationSelect={handleLocationSelect}
                        initialLat={formData.latitude}
                        initialLng={formData.longitude}
                      />
                    </div>
                  </div>
                </div>

                {/* Next Button for Step 1 */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-lg font-bold text-white text-base bg-orange-600 hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight size={20} />
                </button>
                  </>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <>
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900">Select Payment Method</h2>
                      {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}

                      <div className="space-y-3">
                        {/* UPI Payment (PayTm, Google Pay, PhonePe) */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('upi')}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            selectedPaymentMethod === 'upi'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">UPI Payment</p>
                              <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedPaymentMethod === 'upi'
                                ? 'border-orange-600 bg-orange-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === 'upi' && (
                                <Check size={16} className="text-white" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Card Payment */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('card')}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            selectedPaymentMethod === 'card'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                              <p className="text-sm text-gray-600">Visa, MasterCard, RuPay</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedPaymentMethod === 'card'
                                ? 'border-orange-600 bg-orange-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === 'card' && (
                                <Check size={16} className="text-white" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Net Banking */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('netbanking')}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            selectedPaymentMethod === 'netbanking'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Net Banking</p>
                              <p className="text-sm text-gray-600">All major banks</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedPaymentMethod === 'netbanking'
                                ? 'border-orange-600 bg-orange-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === 'netbanking' && (
                                <Check size={16} className="text-white" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Cash on Delivery */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('cod')}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            selectedPaymentMethod === 'cod'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Cash on Delivery</p>
                              <p className="text-sm text-gray-600">Pay when you receive</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedPaymentMethod === 'cod'
                                ? 'border-orange-600 bg-orange-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedPaymentMethod === 'cod' && (
                                <Check size={16} className="text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Payment Details Based on Selection */}
                    {selectedPaymentMethod === 'card' && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Card Details</h3>
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
                              placeholder="MM/YY"
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
                              placeholder="CVV"
                              maxLength="3"
                            />
                            {errors.cardCVV && <p className="text-red-500 text-xs mt-1">{errors.cardCVV}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'upi' && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Enter UPI ID</h3>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.upiId ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="yourname@paytm"
                        />
                        {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
                      </div>
                    )}

                    {selectedPaymentMethod === 'netbanking' && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Select Bank</h3>
                        <select
                          name="netBankingBank"
                          value={formData.netBankingBank}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.netBankingBank ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Choose your bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="pnb">Punjab National Bank</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.netBankingBank && <p className="text-red-500 text-xs mt-1">{errors.netBankingBank}</p>}
                      </div>
                    )}

                    {/* Action Buttons for Step 2 */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        className="flex-1 py-4 rounded-lg font-bold text-gray-700 text-base bg-gray-200 hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={20} />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={`flex-[2] py-4 rounded-lg font-bold text-white text-base transition-all ${
                          isProcessing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-700 hover:bg-green-800'
                        }`}
                      >
                        {isProcessing ? 'Processing...' : `Pay ₹${Math.round(finalTotal)}`}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Right Side - Order Summary */}
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

                {/* Coupon Code */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Have a coupon code?
                  </label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {couponLoading ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-green-800">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-600">{couponError}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{Math.round(cartTotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-medium">-₹{Math.round(discount)}</span>
                    </div>
                  )}
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
