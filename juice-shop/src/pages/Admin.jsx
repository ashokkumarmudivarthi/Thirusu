import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';
import { Package, TrendingUp, TrendingDown, RefreshCw, Save, X, ShoppingCart, User, Calendar, DollarSign } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStock, setEditingStock] = useState({});
  const [stockUpdates, setStockUpdates] = useState({});
  const [editingDeliveryDate, setEditingDeliveryDate] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch products
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (productSizeId, newStock) => {
    setStockUpdates(prev => ({
      ...prev,
      [productSizeId]: parseInt(newStock) || 0
    }));
  };

  const handleSaveStock = async (productSizeId, currentStock) => {
    const newStock = stockUpdates[productSizeId];
    if (newStock === undefined || newStock === currentStock) {
      setEditingStock(prev => ({ ...prev, [productSizeId]: false }));
      return;
    }

    try {
      setSaving(true);
      await productsAPI.updateStock(productSizeId, newStock, 'Manual stock update by admin');
      
      // Refresh products from server to get latest data
      await fetchProducts();

      setEditingStock(prev => ({ ...prev, [productSizeId]: false }));
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productSizeId];
        return updated;
      });

      setSuccessMessage('Stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = (productSizeId) => {
    setEditingStock(prev => ({ ...prev, [productSizeId]: false }));
    setStockUpdates(prev => {
      const updated = { ...prev };
      delete updated[productSizeId];
      return updated;
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, deliveryDate = null) => {
    try {
      setSaving(true);
      await ordersAPI.updateOrderStatus(orderId, newStatus, deliveryDate);
      
      // Update local state
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          const updated = { ...order, status: newStatus };
          if (deliveryDate) {
            updated.estimated_delivery_date = deliveryDate;
          }
          return updated;
        }
        return order;
      }));

      setSuccessMessage('Order status updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update order status: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
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

  const getTotalStock = (product) => {
    return product.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the admin panel.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-2">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mb-6">Current user: {user?.email} (Role: {user?.role || 'customer'})</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
        <TopScroll />
        <Navbar 
          activePrimary="Admin"
          currentMenuColor="#FF6B35"
          showLeftList={false}
          onLogoClick={() => navigate('/')}
        />
      </header>

      <div className="flex-1" style={{ paddingTop: '180px', paddingBottom: '3rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage products, orders, and inventory</p>
              </div>
              <button
                onClick={activeTab === 'products' ? fetchProducts : fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'products'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={20} />
                  Products & Stock
                </div>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Orders
                </div>
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg flex items-center gap-2">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && activeTab === 'products' && (
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Product Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{product.name}</h3>
                          <p className="text-orange-100 text-sm">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{getTotalStock(product)}</div>
                        <div className="text-orange-100 text-sm">Total Units</div>
                      </div>
                    </div>
                  </div>

                  {/* Size Variants Table */}
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Size</th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Price</th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Current Stock</th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.sizes.map((size) => {
                            const status = getStockStatus(size.stock);
                            const isEditing = editingStock[size.id];
                            const updatedStock = stockUpdates[size.id] ?? size.stock;

                            return (
                              <tr key={size.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-4">
                                  <span className="font-semibold text-gray-900">{size.size}</span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-gray-700">₹{size.price}</span>
                                </td>
                                <td className="py-4 px-4">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      min="0"
                                      value={updatedStock}
                                      onChange={(e) => handleStockChange(size.id, e.target.value)}
                                      className="w-24 px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="text-2xl font-bold text-gray-900">{size.stock}</span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
                                    {status.label}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleSaveStock(size.id, size.stock)}
                                        disabled={saving}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                      >
                                        <Save size={16} />
                                        Save
                                      </button>
                                      <button
                                        onClick={() => handleCancelEdit(size.id)}
                                        disabled={saving}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                      >
                                        <X size={16} />
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setEditingStock(prev => ({ ...prev, [size.id]: true }))}
                                      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                    >
                                      Update Stock
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Orders Section */}
          {!loading && activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl">
                  <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No orders yet</p>
                </div>
              ) : (
                orders.map((order) => {
                  const statusInfo = getOrderStatusColor(order.status);
                  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                            <p className="text-orange-100 text-sm">{orderDate}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">₹{parseFloat(order.total_amount).toFixed(2)}</div>
                            <div className="text-orange-100 text-sm">{order.item_count} items</div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Customer Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <User size={18} />
                              Customer Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Name:</span> {order.customer_name}</p>
                              <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                              <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                              <p><span className="font-medium">Address:</span> {order.delivery_address}</p>
                            </div>
                          </div>

                          {/* Order Status */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Order Status & Delivery</h4>
                            <select
                              value={order.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                const currentDate = editingDeliveryDate[order.id];
                                handleUpdateOrderStatus(order.id, newStatus, currentDate);
                              }}
                              disabled={saving}
                              className={`w-full px-4 py-2 rounded-lg font-semibold border-2 ${statusInfo.bg} ${statusInfo.text} disabled:opacity-50 cursor-pointer mb-3`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Delivery Date
                              </label>
                              <input
                                type="date"
                                value={editingDeliveryDate[order.id] || order.estimated_delivery_date || ''}
                                onChange={(e) => setEditingDeliveryDate(prev => ({ ...prev, [order.id]: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                              {editingDeliveryDate[order.id] && editingDeliveryDate[order.id] !== order.estimated_delivery_date && (
                                <button
                                  onClick={() => {
                                    handleUpdateOrderStatus(order.id, order.status, editingDeliveryDate[order.id]);
                                    setEditingDeliveryDate(prev => {
                                      const updated = { ...prev };
                                      delete updated[order.id];
                                      return updated;
                                    });
                                  }}
                                  disabled={saving}
                                  className="mt-2 w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm disabled:opacity-50"
                                >
                                  Update Delivery Date
                                </button>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500">Payment: {order.payment_method || 'Credit Card'}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Product</th>
                                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Size</th>
                                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Qty</th>
                                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Price</th>
                                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) => (
                                  <tr key={item.id} className="border-t border-gray-100">
                                    <td className="py-3 px-4">{item.productName}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{item.size}</td>
                                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                                    <td className="py-3 px-4 text-right">₹{parseFloat(item.price).toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right font-semibold">₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
