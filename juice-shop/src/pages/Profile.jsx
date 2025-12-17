import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';

export default function Profile() {
  const { user, logout, isGuestMode } = useAuth();
  const navigate = useNavigate();

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  };

  if (isGuestMode) {
    navigate('/login');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const orders = JSON.parse(localStorage.getItem('thirusu-orders') || '[]');
  const userOrders = orders.filter(order => order.email === user.email);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar 
          activePrimary="Profile"
          menuColors={menuColors}
          currentMenuColor="#FF6B35"
          showLeftList={true}
          onLogoClick={() => navigate('/')}
        />
      </header>

      <div className="flex-1 bg-gray-50" style={{ paddingTop: '220px', paddingBottom: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-2">Member since {new Date(user.id).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <button
              onClick={() => navigate('/wishlist')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Wishlist</h3>
                  <p className="text-sm text-gray-500">View saved items</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shop</h3>
                  <p className="text-sm text-gray-500">Continue shopping</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-500">Account preferences</p>
                </div>
              </div>
            </button>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
            
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 text-lg">No orders yet</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id || index + 1}</h3>
                        <p className="text-sm text-gray-500">{order.date || 'Recent order'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">₹{Math.round(order.total)}</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Delivery to:</span> {order.address}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Items:</span> {order.items?.length || 0} products
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
