import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, Search, Heart, User, ShoppingCart, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ 
  activePrimary, 
  onPrimaryChange, 
  onMenuHover, 
  onLogoClick,
  menuColors,
  currentMenuColor,
  showLeftList,
  onCartClick,
  onSearchClick
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { label: 'Fresh Bar', key: 'Fresh Bar' },
    { label: 'Reset', key: 'Reset' },
    { label: 'Thrive', key: 'Thrive' },
    { label: 'Our Story', key: 'Our Story' },
  ]

  const hoverMenus = ['Fresh Bar', 'Reset', 'Thrive']

  const handleDesktopClick = (itemKey) => {
    if (hoverMenus.includes(itemKey)) {
      // Click should open the shop section with sticky bar
      onPrimaryChange(itemKey, true)
    } else {
      onPrimaryChange(itemKey)
    }
  }

  const handleMobileClick = (itemKey) => {
    if (hoverMenus.includes(itemKey)) {
      onPrimaryChange(itemKey, true)
    } else {
      onPrimaryChange(itemKey)
    }
    setIsOpen(false)
  }

  return (
    <nav 
      className="w-full transition-all duration-300"
      style={{ 
        background: showLeftList ? 'white' : 'transparent',
        boxShadow: showLeftList ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : 'none',
      }}
    >
      <div className="w-full px-12" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div className="flex justify-between items-center gap-8">
          {/* Logo - Clickable */}
          <button 
            onClick={onLogoClick}
            className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <h1 className="text-4xl font-extrabold tracking-tight whitespace-nowrap flex items-center gap-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                Thiru
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500">
                Su
              </span>
              <span className="text-3xl">🍹</span>
            </h1>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-20 flex-1">
            {menuItems.map((item) => (
              <div 
                key={item.key}
                // Hover actions temporarily disabled - only click actions active
                // onMouseEnter={() => hoverMenus.includes(item.key) && onMenuHover(item.key)}
                // onMouseLeave={() => hoverMenus.includes(item.key) && onMenuHover(null)}
              >
                <button
                  onClick={() => handleDesktopClick(item.key)}
                  className={`text-base font-bold transition-all duration-300 pb-3 border-b-3 flex items-center gap-2`}
                  style={{
                    color: activePrimary === item.key ? menuColors[item.key] : '#222222',
                    borderBottomColor: activePrimary === item.key ? menuColors[item.key] : 'transparent',
                  }}
                  // Hover color changes temporarily disabled
                  // onMouseEnter={(e) => {
                  //   if (hoverMenus.includes(item.key)) {
                  //     e.currentTarget.style.color = menuColors[item.key]
                  //     e.currentTarget.style.borderBottomColor = menuColors[item.key]
                  //   }
                  // }}
                  // onMouseLeave={(e) => {
                  //   if (activePrimary !== item.key) {
                  //     e.currentTarget.style.color = '#222222'
                  //     e.currentTarget.style.borderBottomColor = 'transparent'
                  //   }
                  // }}
                >
                  {item.label}
                  <ChevronDown size={20} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-8 mr-8">
            <button 
              onClick={onSearchClick}
              className="text-gray-800 hover:opacity-70 transition-all duration-200 p-2"
              style={{ color: currentMenuColor }}
            >
              <Search size={28} strokeWidth={2} />
            </button>
            <button 
              onClick={() => navigate('/wishlist')}
              className="relative text-gray-800 hover:opacity-70 transition-all duration-200 p-2"
              style={{ color: currentMenuColor }}
            >
              <Heart size={28} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                  style={{ backgroundColor: currentMenuColor }}
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    setShowUserMenu(!showUserMenu)
                  } else {
                    navigate('/login')
                  }
                }}
                className="text-gray-800 hover:opacity-70 transition-all duration-200 p-2"
                style={{ color: currentMenuColor }}
              >
                <User size={28} strokeWidth={2} />
              </button>
              {showUserMenu && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/my-orders')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate('/wishlist')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                      navigate('/')
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-t border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={onCartClick}
              className="relative text-gray-800 hover:opacity-70 transition-all duration-200 p-2"
              style={{ color: currentMenuColor }}
            >
              <ShoppingCart size={28} strokeWidth={2} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce"
                  style={{ backgroundColor: currentMenuColor }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-colors mr-4"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: currentMenuColor }}
          >
            {isOpen ? (
              <X size={28} strokeWidth={1.5} />
            ) : (
              <Menu size={28} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t-2 border-gray-200 pt-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMobileClick(item.key)}
                className={`w-full text-left px-4 py-3 text-base font-bold rounded transition-all text-white`}
                style={{
                  backgroundColor: activePrimary === item.key ? menuColors[item.key] : '#f0f0f0',
                  color: activePrimary === item.key ? 'white' : '#222222',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}