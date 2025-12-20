import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';
import { Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react';

export default function MyOrders() {
  const { user, isGuestMode } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  };

  useEffect(() => {
    if (isGuestMode || !user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isGuestMode, user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getMyOrders();
      console.log('Fetched orders data:', data);
      console.log('Orders array:', Array.isArray(data) ? data : 'Not an array');
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      console.error('Error details:', error.response?.data);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-600" size={24} />;
      case 'processing': return <Package className="text-blue-600" size={24} />;
      case 'shipped': return <Truck className="text-purple-600" size={24} />;
      case 'delivered': return <CheckCircle className="text-green-600" size={24} />;
      case 'cancelled': return <XCircle className="text-red-600" size={24} />;
      default: return <Clock className="text-gray-600" size={24} />;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
      case 'processing': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' };
      case 'shipped': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' };
      case 'delivered': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  if (isGuestMode || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar 
          activePrimary="My Orders"
          menuColors={menuColors}
          currentMenuColor="#FF6B35"
          showLeftList={true}
          onLogoClick={() => navigate('/')}
        />
      </header>

      <div className="flex-1 bg-gray-50" style={{ paddingTop: '220px', paddingBottom: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track your orders and delivery status</p>
            </div>
            <button
              onClick={fetchOrders}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg mb-4">No orders yet</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = getOrderStatusColor(order.status);
                  const statusProgress = getStatusProgress(order.status);
                  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  
                  console.log(`Order #${order.id} - estimated_delivery_date:`, order.estimated_delivery_date);
                  
                  const deliveryDate = order.estimated_delivery_date 
                    ? new Date(order.estimated_delivery_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : null;

                  return (
                    <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">Placed on {orderDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-orange-600">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                          <span className={`inline-block px-3 py-1 ${statusInfo.bg} ${statusInfo.text} text-sm rounded-full font-semibold`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Order Status Timeline */}
                        {order.status !== 'cancelled' && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getOrderStatusIcon(order.status)}
                                <span className="font-semibold text-gray-900">{statusInfo.label}</span>
                              </div>
                              {deliveryDate && order.status !== 'delivered' && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Expected:</span> {deliveryDate}
                                </div>
                              )}
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${statusProgress}%` }}
                              ></div>
                            </div>

                            {/* Status Steps */}
                            <div className="flex justify-between mt-3 text-xs text-gray-600">
                              <div className={`text-center ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-orange-600 font-semibold' : ''}`}>
                                <div className="mb-1">📋</div>
                                <div>Pending</div>
                              </div>
                              <div className={`text-center ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-orange-600 font-semibold' : ''}`}>
                                <div className="mb-1">📦</div>
                                <div>Processing</div>
                              </div>
                              <div className={`text-center ${['shipped', 'delivered'].includes(order.status) ? 'text-orange-600 font-semibold' : ''}`}>
                                <div className="mb-1">🚚</div>
                                <div>Shipped</div>
                              </div>
                              <div className={`text-center ${order.status === 'delivered' ? 'text-green-600 font-semibold' : ''}`}>
                                <div className="mb-1">✅</div>
                                <div>Delivered</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {order.status === 'cancelled' && (
                          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                              <XCircle size={20} />
                              <span className="font-semibold">This order has been cancelled</span>
                            </div>
                          </div>
                        )}

                        {/* Delivery Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                            <p className="text-sm text-gray-600 mt-1">{order.delivery_address}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Contact</p>
                            <p className="text-sm text-gray-600 mt-1">{order.customer_email}</p>
                            <p className="text-sm text-gray-600">{order.customer_phone}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                          <div className="space-y-2">
                            {order.items && order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                  <p className="text-xs text-gray-500">{item.size} × {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
