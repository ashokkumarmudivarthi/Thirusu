import { useState, useRef, useEffect } from 'react'
import TopScroll from '../sections/TopScroll'
import Navbar from '../components/Navbar'
import HeroShowcase from '../sections/HeroShowcase'
import ShopCategoryBar from '../sections/ShopCategoryBar'
import ProductGrid from '../sections/ProductGrid'
import HealthJourney from '../sections/HealthJourney'
import ThreeBlocks from '../sections/ThreeBlocks'
import WhySection from '../sections/WhySection'
import Footer from '../components/Footer'
import Cart from './Cart'
import SearchModal from '../components/SearchModal'
import { products } from '../utils/products'

export default function Home() {
  const [activePrimary, setActivePrimary] = useState('Home')
  const [activeShopItem, setActiveShopItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [showLeftList, setShowLeftList] = useState(false) // controls shop section visibility
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0) // for auto-slideshow
  const [showCart, setShowCart] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const shopSectionRef = useRef(null)
  const hoverTimeoutRef = useRef(null)

  const menuColors = {
    Shop: '#FF6B35',
    Cleanses: '#00A86B',
    'Meal Plans': '#8B4513',
    'About Us': '#4169E1',
  }

  const heroConfigs = {
    Home: [
      {
        key: 'slide-1',
        title: 'Fresh & Healthy',
        description: 'Explore our collection of premium juices',
        image: '/assets/hero/hero-1.png',
      },
      {
        key: 'slide-2',
        title: 'Pure & Natural',
        description: 'Cold-pressed goodness in every bottle',
        image: '/assets/hero/hero-2.png',
      },
      {
        key: 'slide-3',
        title: 'Refresh & Energize',
        description: 'Your daily dose of vitamins and wellness',
        image: '/assets/hero/hero-3.png',
      },
    ],
    Shop: [
      {
        key: 'All',
        title: 'Shop All Juices',
        description:
          'Discover our complete collection of fresh, cold-pressed juices.',
        image: '/assets/hero/shop-all.png',
      },
      {
        key: 'Detox',
        title: 'Detox Cleanses',
        description: 'Reset your body with nutrient-dense detox juices.',
        image: '/assets/hero/shop-detox.png',
      },
      {
        key: 'Smoothies',
        title: 'Protein Smoothies',
        description:
          'Creamy, filling smoothies packed with protein and nutrients.',
        image: '/assets/hero/shop-smoothies.png',
      },
    ],
    Cleanses: [
      {
        key: '3-Day',
        title: '3-Day Cleanse',
        description: 'Quick reset with our 3-day cleanse program.',
        image: '/assets/hero/cleanse-3day.png',
      },
      {
        key: '5-Day',
        title: '5-Day Cleanse',
        description: 'Deep detox with our 5-day cleanse program.',
        image: '/assets/hero/cleanse-5day.png',
      },
      {
        key: '7-Day',
        title: '7-Day Cleanse',
        description: 'Complete body reset with our 7-day cleanse program.',
        image: '/assets/hero/cleanse-7day.png',
      },
    ],
    'Meal Plans': [
      {
        key: 'Starter',
        title: 'Starter Plan',
        description:
          'Perfect for beginners - fresh juices with simple meals.',
        image: '/assets/hero/meal-starter.png',
      },
      {
        key: 'Premium',
        title: 'Premium Plan',
        description: 'Advanced nutrition - curated juices and organic meals.',
        image: '/assets/hero/meal-premium.png',
      },
      {
        key: 'Elite',
        title: 'Elite Plan',
        description:
          'Ultimate wellness - personalized juices and gourmet meals.',
        image: '/assets/hero/meal-elite.png',
      },
    ],
    'About Us': [
      {
        key: 'default',
        title: 'Our Story',
        description: 'Committed to delivering the freshest beverages.',
        image: '/assets/hero/hero-1.png',
      },
    ],
  }

  const menuSubItems = {
    Shop: ['All', 'Detox', 'Smoothies'],
    Cleanses: ['3-Day Cleanse', '5-Day Cleanse', '7-Day Cleanse'],
    'Meal Plans': ['Starter Plan', 'Premium Plan', 'Elite Plan'],
  }

  // Sticky category bar tabs - different for each menu
  const shopCategoriesByMenu = {
    Shop: ['All', 'Detox', 'Smoothies', 'Protein', 'Wellness'],
    Cleanses: ['Shop All Cleanses', 'Juice Cleanses', '3-Day Cleanse', '5-Day Cleanse', '7-Day Cleanse'],
    'Meal Plans': ['Shop All Meals', 'The PRESS Plan', 'Meal Delivery', '5:2 Diet'],
  }

  // Auto-slideshow for home hero images (every 5 seconds)
  useEffect(() => {
    if (activePrimary === 'Home' && !showLeftList && !isHovered) {
      const heroSlides = heroConfigs.Home
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [activePrimary, showLeftList, isHovered])

  // Reset to home page
  const handleLogoClick = () => {
    setActivePrimary('Home')
    setShowLeftList(false)
    setActiveShopItem(null)
    setIsHovered(false)
    setHoveredMenu(null)
    setActiveCategory('All')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Called by Navbar on click
  const handlePrimaryChange = (key, openShop = false) => {
    setActivePrimary(key)
    setActiveShopItem(null)
    setIsHovered(false)
    setHoveredMenu(null)

    if (openShop && (key === 'Shop' || key === 'Cleanses' || key === 'Meal Plans')) {
      // Open full shop section like Press London "Shop All" page
      setShowLeftList(true)
      setActiveCategory('All')

      setTimeout(() => {
        shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      // For Home, About Us, etc.
      setShowLeftList(false)
    }
  }

  // Hover over top nav (Shop/Cleanses/Meal Plans) for two-column preview
  const handleMenuHover = (menuKey) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    if (menuKey) {
      setIsHovered(true)
      setHoveredMenu(menuKey)
      setActivePrimary(menuKey)
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false)
        setHoveredMenu(null)
        if (!showLeftList) {
          setActivePrimary('Home')
        }
      }, 300)
    }
  }

  // Click inside left column of the hover preview
  const handleMenuItemChange = (item) => {
    setActiveShopItem(item)
    // Only changes the preview; does NOT open the shop section
    setIsHovered(false)
    setHoveredMenu(null)
  }

  // Get the appropriate category list based on active menu
  const currentCategories = shopCategoriesByMenu[activePrimary] || shopCategoriesByMenu.Shop
  const currentMenuColor = menuColors[activePrimary] || '#FF6B35'

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Header - Overlays on hero images */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <TopScroll />
        <Navbar
          activePrimary={activePrimary}
          onPrimaryChange={handlePrimaryChange}
          onMenuHover={handleMenuHover}
          onLogoClick={handleLogoClick}
          menuColors={menuColors}
          currentMenuColor={currentMenuColor}
          showLeftList={showLeftList}
          onCartClick={() => setShowCart(true)}
          onSearchClick={() => setShowSearch(true)}
        />
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />

      {/* Hero Section with Extended Hover Zone */}
      <div
        className="relative"
        onMouseEnter={() => {
          if (isHovered && hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
          }
        }}
        onMouseLeave={() => {
          if (isHovered && !showLeftList) {
            hoverTimeoutRef.current = setTimeout(() => {
              setIsHovered(false)
              setHoveredMenu(null)
              setActivePrimary('Home')
            }, 200)
          }
        }}
      >
        {/* Hover Dropdown Menu - appears below navbar */}
        {isHovered && !showLeftList && (
          <div className="absolute left-0 right-0 z-40 bg-white border-b-2" style={{ top: '160px', borderColor: currentMenuColor }}>
            <div className="w-full h-[400px] flex">
              {/* Left Sidebar - Menu */}
              <div 
                className="hidden md:flex md:w-1/4 flex-col px-8 py-8 bg-gray-50 border-r-2"
                style={{ borderColor: currentMenuColor }}
              >
                <h3 className="text-xl font-bold mb-6" style={{ color: currentMenuColor }}>
                  {hoveredMenu}
                </h3>
                <nav className="space-y-3">
                  {menuSubItems[hoveredMenu]?.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleMenuItemChange(item)}
                      className="block text-left text-base font-medium transition-all duration-200 hover:translate-x-2"
                      style={{ color: '#333' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = currentMenuColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Right Side - Large Image */}
              <div className="flex-1 relative">
                <img
                  src={heroConfigs[hoveredMenu]?.[0]?.image}
                  alt={hoveredMenu}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        <HeroShowcase
          activePrimary={activePrimary}
          activeShopItem={activeShopItem}
          onMenuItemChange={handleMenuItemChange}
          heroConfigs={heroConfigs}
          showLeftList={showLeftList}
          isHovered={isHovered}
          hoveredMenu={hoveredMenu}
          menuSubItems={menuSubItems}
          currentMenuColor={currentMenuColor}
          currentHeroIndex={currentHeroIndex}
        />
      </div>

      {/* Shop Section with Sticky Category Bar (shows on click of Shop/Cleanses/Meal Plans) */}
      <section ref={shopSectionRef} className="bg-white" style={{ paddingTop: '160px' }}>
        {showLeftList &&
          (activePrimary === 'Shop' ||
            activePrimary === 'Cleanses' ||
            activePrimary === 'Meal Plans') && (
            <>
              {/* Shop Header Section - COMMENTED OUT */}
              {/* <div className="bg-cream py-12 px-8 sm:px-12 lg:px-20">
                <div className="mb-6">
                  <span className="text-sm text-gray-600">Home</span>
                  <span className="text-sm text-gray-400 mx-2">•</span>
                  <span className="text-sm text-gray-900 font-medium">Shop Products</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-serif mb-8">Shop Products.</h1>

                <div className="flex flex-wrap gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span className="font-medium">Free Delivery for boxes over ₹4000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-medium">Subscribe for up to 20% off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">Cancel Anytime</span>
                  </div>
                </div>
              </div> */}

              <ShopCategoryBar
                categories={currentCategories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                menuColor={currentMenuColor}
              />
              <ProductGrid
                products={products}
                activeCategory={activeCategory}
                title="Our Collection"
                menuColor={currentMenuColor}
              />
            </>
          )}
      </section>

      {/* Health Journey Section - Only show on home page */}
      {!showLeftList && activePrimary === 'Home' && <HealthJourney />}

      {/* Additional Sections */}
      <ThreeBlocks />
      <WhySection />
      <Footer />

      {/* Cart Modal */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  )
}