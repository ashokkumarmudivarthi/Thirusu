import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import SearchModal from './SearchModal'
import ProductDetail from './ProductDetail'
import Cart from '../pages/Cart'
import { useCart } from '../context/CartContext'

export default function Layout({ children, customNavbar }) {
  const [showSearch, setShowSearch] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Don't show layout navbar on home page or admin page (they have their own)
  const isHomePage = location.pathname === '/'
  const isAdminPage = location.pathname === '/admin'
  
  // Default menu colors
  const menuColors = {
    'Fresh Bar': '#FF6B35',
    'Reset': '#00A86B',
    'Thrive': '#8B4513',
    'Our Story': '#4169E1',
  }
  
  const currentMenuColor = '#FF6B35'

  if (isHomePage || isAdminPage) {
    // Home page and admin page handle their own navbar
    return <>{children}</>
  }

  return (
    <>
      {!customNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <Navbar
            activePrimary="Home"
            onPrimaryChange={(key) => {
              if (key === 'Home') {
                navigate('/')
              }
            }}
            onMenuHover={() => {}}
            onLogoClick={() => navigate('/')}
            menuColors={menuColors}
            currentMenuColor={currentMenuColor}
            showLeftList={false}
            onCartClick={() => setShowCart(true)}
            onSearchClick={() => setShowSearch(true)}
          />
        </div>
      )}
      
      {/* Add padding top to prevent content from going under fixed navbar */}
      <div className={!customNavbar ? 'pt-32' : ''}>
        {children}
      </div>

      {/* Search Modal - Available on all pages */}
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
          menuColor={currentMenuColor}
        />
      )}

      {/* Cart Modal */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </>
  )
}
