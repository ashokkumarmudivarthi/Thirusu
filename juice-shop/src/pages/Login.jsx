import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import ProductDetail from '../components/ProductDetail';
import Cart from './Cart';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { login, continueAsGuest, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  };

  const from = location.state?.from || '/';

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await login(email, password);
        navigate(from, { replace: true });
      } catch (err) {
        // Error is already set in AuthContext
        console.error('Login error:', err);
      }
    }
  };

  const handleGuestCheckout = () => {
    continueAsGuest();
    navigate('/checkout', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar 
          activePrimary="Login"
          menuColors={menuColors}
          currentMenuColor="#FF6B35"
          showLeftList={true}
          onLogoClick={() => navigate('/')}
          onSearchClick={() => setShowSearch(true)}
          onCartClick={() => setShowCart(true)}
        />
      </header>

      <div className="flex-1 flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: '180px' }}>
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-6xl font-serif text-gray-900 mb-4">Login.</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-600 text-base">
              If you have an account with us, please log in.
            </p>
          </div>

          {/* Form */}
          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`block w-full px-4 py-4 border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  } rounded-none focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`block w-full px-4 py-4 border ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  } rounded-none focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* API Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 bg-gradient-to-r from-lime-300 to-lime-400 hover:from-lime-400 hover:to-lime-500 text-gray-900 font-bold text-base tracking-wider uppercase rounded-none transition-all duration-300 shadow-md hover:shadow-lg ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="space-y-4 text-center pt-6">
            <div>
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-gray-900 underline hover:text-orange-600 transition-colors">
                Create an Account
              </Link>
            </div>
            
            <div>
              <a href="#" className="text-gray-900 underline hover:text-orange-600 transition-colors block">
                Forgot Your Password?
              </a>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGuestCheckout}
                className="text-gray-900 underline hover:text-orange-600 transition-colors"
              >
                Manage subscriptions
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onProductClick={(product) => setSelectedProduct(product)}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          menuColor="#FF6B35"
        />
      )}

      {/* Cart Modal */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
}
