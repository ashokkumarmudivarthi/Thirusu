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
              onClick={() => navigate('/my-orders')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">My Orders</h3>
                  <p className="text-sm text-gray-500">Track your orders</p>
                </div>
              </div>
            </button>

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
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-900 font-medium">{new Date(user.id).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}