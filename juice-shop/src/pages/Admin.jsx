import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';
import { Package, TrendingUp, TrendingDown, RefreshCw, Save, X, ShoppingCart, User, Calendar, DollarSign, MessageCircle, Send } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'offers', or 'support'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [chatFilter, setChatFilter] = useState('active'); // 'active' or 'closed'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  const [orderSort, setOrderSort] = useState('newest'); // 'newest' or 'oldest'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStock, setEditingStock] = useState({});
  const [stockUpdates, setStockUpdates] = useState({});
  const [editingDeliveryDate, setEditingDeliveryDate] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newOffer, setNewOffer] = useState({ text: '', icon: '🎉', is_active: true });
  const [editingOffer, setEditingOffer] = useState(null);
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
    } else if (activeTab === 'offers') {
      fetchOffers();
    } else if (activeTab === 'support') {
      fetchChatSessions();
    }
  }, [activeTab, chatFilter]);

  useEffect(() => {
    if (selectedSession && activeTab === 'support') {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSession, activeTab]);

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

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Filter by status
    if (orderFilter !== 'all') {
      filtered = filtered.filter(o => o.status === orderFilter);
    }
    
    // Sort by time based on orderSort
    if (orderSort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    
    return filtered;
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/offers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOffers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load offers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async () => {
    if (!newOffer.text.trim()) {
      alert('Please enter offer text');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('http://localhost:5000/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: newOffer.text,
          icon: newOffer.icon,
          is_active: newOffer.is_active,
          display_order: offers.length + 1
        })
      });

      if (response.ok) {
        setNewOffer({ text: '', icon: '🎉', is_active: true });
        await fetchOffers();
        setSuccessMessage('Offer created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to create offer');
      }
    } catch (err) {
      alert('Failed to create offer: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOffer = async (offerId, updates) => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchOffers();
        setEditingOffer(null);
        setSuccessMessage('Offer updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to update offer');
      }
    } catch (err) {
      alert('Failed to update offer: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOffer = async (offerId) => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchOffers();
        setSuccessMessage('Offer status toggled!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to toggle offer');
      }
    } catch (err) {
      alert('Failed to toggle offer: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchOffers();
        setSuccessMessage('Offer deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to delete offer');
      }
    } catch (err) {
      alert('Failed to delete offer: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Chat Support Functions
  const fetchChatSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/chat/sessions/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      // Filter based on chatFilter state
      const filtered = chatFilter === 'active' 
        ? data.filter(s => s.status === 'waiting' || s.status === 'active')
        : data.filter(s => s.status === 'closed');
      setChatSessions(filtered);
    } catch (err) {
      console.error('Error fetching chat sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    if (!selectedSession) return;
    try {
      const response = await fetch(`http://localhost:5000/api/chat/sessions/${selectedSession.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setChatMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendChatMessage = async () => {
    if (!newChatMessage.trim() || !selectedSession) return;
    try {
      const response = await fetch(`http://localhost:5000/api/chat/sessions/${selectedSession.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: newChatMessage })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, data]);
      setNewChatMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const closeChatSession = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/sessions/${sessionId}/close`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        alert('Chat session closed successfully');
        setSelectedSession(null);
        setChatMessages([]);
        fetchChatSessions(); // Refresh the list
      }
    } catch (err) {
      console.error('Error closing session:', err);
      alert('Failed to close session');
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

      <div className="flex-1" style={{ paddingTop: '240px', paddingBottom: '3rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage products, orders, and inventory</p>
              </div>
              <div className="flex items-center gap-3">
                {(user?.role === 'admin' || user?.role === 'support') && (
                  <button
                    onClick={() => navigate('/support')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <ShoppingCart size={18} />
                    Support Dashboard
                  </button>
                )}
                <button
                  onClick={activeTab === 'products' ? fetchProducts : activeTab === 'orders' ? fetchOrders : fetchOffers}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>
              </div>
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
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'offers'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Scrolling Offers
                </div>
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'support'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  Customer Support
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
              {/* Order Filters */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort by Time</label>
                    <select
                      value={orderSort}
                      onChange={(e) => setOrderSort(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Showing {getFilteredOrders().length} of {orders.length} orders
                </p>
              </div>

              {getFilteredOrders().length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl">
                  <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No orders found</p>
                </div>
              ) : (
                getFilteredOrders().map((order) => {
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

          {/* Offers Section */}
          {!loading && activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Create New Offer */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Offer</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Text</label>
                    <input
                      type="text"
                      value={newOffer.text}
                      onChange={(e) => setNewOffer({ ...newOffer, text: e.target.value })}
                      placeholder="e.g., FREE SHIPPING ON ORDERS OVER $50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon/Emoji</label>
                    <input
                      type="text"
                      value={newOffer.icon}
                      onChange={(e) => setNewOffer({ ...newOffer, icon: e.target.value })}
                      placeholder="🎉"
                      maxLength={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreateOffer}
                      disabled={saving || !newOffer.text.trim()}
                      className="w-full px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Offer
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Offers */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">Manage Scrolling Offers</h3>
                  <p className="text-orange-100 text-sm">Total: {offers.length} offers</p>
                </div>
                <div className="p-6">
                  {offers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No offers yet. Create your first offer above!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {offers.map((offer) => (
                        <div
                          key={offer.id}
                          className={`border-2 rounded-lg p-4 transition-all ${
                            offer.is_active ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          {editingOffer?.id === offer.id ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="md:col-span-2">
                                  <input
                                    type="text"
                                    value={editingOffer.text}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={editingOffer.icon}
                                    onChange={(e) => setEditingOffer({ ...editingOffer, icon: e.target.value })}
                                    maxLength={10}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdateOffer(offer.id, editingOffer)}
                                    disabled={saving}
                                    className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm disabled:opacity-50"
                                  >
                                    <Save size={16} className="inline mr-1" />
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingOffer(null)}
                                    disabled={saving}
                                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm disabled:opacity-50"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{offer.icon}</span>
                                <span className={`font-medium ${offer.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {offer.text}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  offer.is_active 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {offer.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                  onClick={() => setEditingOffer({ ...offer })}
                                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleOffer(offer.id)}
                                  disabled={saving}
                                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                                    offer.is_active
                                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                      : 'bg-green-500 hover:bg-green-600 text-white'
                                  }`}
                                >
                                  {offer.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleDeleteOffer(offer.id)}
                                  disabled={saving}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Support Chat Section */}
          {!loading && activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Sessions List */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-md">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
                  <h3 className="font-bold text-white">Customer Chats ({chatSessions.length})</h3>
                  <p className="text-xs text-blue-100">Click a chat to view and respond</p>
                  
                  {/* Filter Tabs */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setChatFilter('active')}
                      className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors ${
                        chatFilter === 'active' 
                          ? 'bg-white text-blue-600 font-semibold' 
                          : 'bg-blue-600 text-blue-100 hover:bg-blue-700'
                      }`}
                    >
                      Active Chats
                    </button>
                    <button
                      onClick={() => setChatFilter('closed')}
                      className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors ${
                        chatFilter === 'closed' 
                          ? 'bg-white text-blue-600 font-semibold' 
                          : 'bg-blue-600 text-blue-100 hover:bg-blue-700'
                      }`}
                    >
                      Closed
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                  {chatSessions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>No {chatFilter} chats</p>
                    </div>
                  ) : (
                    chatSessions.map(session => (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedSession?.id === session.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-gray-900">
                            {session.customer_display_name || session.customer_name || 'Guest'}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            session.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                            session.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1 line-clamp-1">{session.subject}</div>
                        {session.customer_email && (
                          <div className="text-xs text-gray-500">{session.customer_email}</div>
                        )}
                        {session.unread_count > 0 && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              {session.unread_count} new
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col" style={{ height: '500px' }}>
                {!selectedSession ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-semibold mb-2">Select a customer chat</p>
                      <p className="text-sm">Click on a chat from the left to start responding</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">
                            {selectedSession.customer_display_name || selectedSession.customer_name || 'Guest'}
                          </div>
                          <div className="text-sm text-orange-100">{selectedSession.customer_email}</div>
                          <div className="text-xs text-orange-100">{selectedSession.subject}</div>
                        </div>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                      {chatMessages.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          <p className="mb-2">No messages yet</p>
                          <p className="text-sm">👈 Customer messages will appear on the left</p>
                          <p className="text-sm">Your replies will appear on the right 👉</p>
                        </div>
                      )}
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={msg.id || idx}
                          className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sender_type === 'agent'
                                ? 'bg-orange-500 text-white'
                                : 'bg-blue-100 border-2 border-blue-300 text-gray-900'
                            }`}
                          >
                            {msg.sender_name && (
                              <div className={`text-xs font-semibold mb-1 ${
                                msg.sender_type === 'agent' ? 'text-orange-100' : 'text-blue-700'
                              }`}>
                                {msg.sender_type === 'customer' ? '👤 ' : '🎧 '}{msg.sender_name}
                              </div>
                            )}
                            <div className="text-sm">{msg.message}</div>
                            <div className={`text-xs mt-1 ${
                              msg.sender_type === 'agent' ? 'text-orange-100' : 'text-blue-600'
                            }`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    {selectedSession.status !== 'closed' ? (
                      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                        <div className="mb-2 text-xs text-gray-500 flex items-center justify-between">
                          <span>💬 Reply to {selectedSession.customer_display_name || selectedSession.customer_name || 'customer'}</span>
                          <span className="text-green-600">● Online</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                            placeholder="Type your reply and press Enter..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            onClick={sendChatMessage}
                            disabled={!newChatMessage.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                          >
                            <Send size={20} />
                            Send
                          </button>
                        </div>
                        <button
                          onClick={() => closeChatSession(selectedSession.id)}
                          className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 hover:bg-red-50 rounded transition-colors"
                        >
                          Close Chat Session
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        <div className="text-center text-gray-600 py-3">
                          <span className="text-sm font-medium">🔒 This chat session is closed</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
