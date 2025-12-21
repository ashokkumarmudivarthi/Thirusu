import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import TopScroll from '../sections/TopScroll';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import ProductDetail from '../components/ProductDetail';
import Cart from './Cart';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Signup user first
        await signup(formData.name, formData.email, formData.password);
        
        // Send welcome email via EmailJS
        await emailjs.send(
          'service_ie2l1kg',    // Your EmailJS Service ID
          'template_welcome',   // EmailJS Template ID for welcome email
          {
            to_email: formData.email,
            to_name: formData.name,
            from_name: 'ThiruSu Juice Shop'
          },
          '_wCy461WHzxRVNDAm'   // Your EmailJS Public Key
        );
        
        console.log('✅ Welcome email sent successfully!');
        navigate('/', { replace: true });
      } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Still navigate even if email fails
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar 
          activePrimary="Signup"
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
            <h1 className="text-6xl font-serif text-gray-900 mb-4">Sign Up.</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-600 text-base">
              Create your account to get started.
            </p>
          </div>

          {/* Form */}
          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-4 border ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  } rounded-none focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-4 border ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  } rounded-none focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-4 py-4 border ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  } rounded-none focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-gray-900 underline hover:text-orange-600 transition-colors">
                  Terms and Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-gray-900 underline hover:text-orange-600 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-lime-300 to-lime-400 hover:from-lime-400 hover:to-lime-500 text-gray-900 font-bold text-base tracking-wider uppercase rounded-none transition-all duration-300 shadow-md hover:shadow-lg"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="space-y-4 text-center pt-6">
            <div>
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-gray-900 underline hover:text-orange-600 transition-colors">
                Sign In
              </Link>
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
