import { useState, useRef, useEffect } from 'react'
import TopScroll from '../sections/TopScroll'
import Navbar from '../components/Navbar'
import HeroShowcase from '../sections/HeroShowcase'
import SectionHero from '../components/SectionHero'
import ShopCategoryBar from '../sections/ShopCategoryBar'
import ProductGrid from '../sections/ProductGrid'
import HealthJourney from '../sections/HealthJourney'
import ThreeBlocks from '../sections/ThreeBlocks'
import WhySection from '../sections/WhySection'
import Footer from '../components/Footer'
import Cart from './Cart'
import SearchModal from '../components/SearchModal'
import ProductDetail from '../components/ProductDetail'
import PageTransition from '../components/PageTransition'
import { products } from '../utils/products'
import { sectionHeroConfig, sectionHeroGradients } from '../utils/sectionHeroConfig'

export default function Home() {
  const [activePrimary, setActivePrimary] = useState('Home')
  const [activeShopItem, setActiveShopItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All Blends')
  const [activeFlavor, setActiveFlavor] = useState(null) // For flavor-level filtering
  const [showFlavorCategories, setShowFlavorCategories] = useState(false) // Show flavors instead of main categories
  const [showLeftList, setShowLeftList] = useState(false) // controls shop section visibility
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0) // for auto-slideshow
  const [showCart, setShowCart] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isCompactMode, setIsCompactMode] = useState(false) // Compact category bar on scroll
  const [selectedProduct, setSelectedProduct] = useState(null) // Product detail modal
  const [showTransition, setShowTransition] = useState(false) // Page transition animation
  const [transitionColor, setTransitionColor] = useState('#FF6B35') // Transition color
  const shopSectionRef = useRef(null)
  const hoverTimeoutRef = useRef(null)

  const menuColors = {
    'Fresh Bar': '#FF6B35',
    'Reset': '#00A86B',
    'Thrive': '#8B4513',
    'Our Story': '#4169E1',
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
    'Fresh Bar': [
      {
        key: 'All Blends',
        title: 'All Fresh Blends',
        description:
          'Discover our complete collection of fresh, cold-pressed juices.',
        image: '/assets/hero/shop-all.png',
      },
      {
        key: 'Detox Elixirs',
        title: 'Detox Elixirs',
        description: 'Reset your body with nutrient-dense detox juices.',
        image: '/assets/hero/shop-detox.png',
      },
      {
        key: 'Power Smoothies',
        title: 'Power Smoothies',
        description:
          'Creamy, filling smoothies packed with protein and nutrients.',
        image: '/assets/hero/shop-smoothies.png',
      },
    ],
    'Reset': [
      {
        key: 'Quick Reset',
        title: 'Quick Reset Program',
        description: 'Fast-track your wellness with our 3-day reset.',
        image: '/assets/hero/cleanse-3day.png',
      },
      {
        key: 'Deep Cleanse',
        title: 'Deep Cleanse Program',
        description: 'Intensive purification with our 5-day deep cleanse.',
        image: '/assets/hero/cleanse-5day.png',
      },
      {
        key: 'Total Reboot',
        title: 'Total Reboot Program',
        description: 'Complete transformation with our 7-day total reboot.',
        image: '/assets/hero/cleanse-7day.png',
      },
    ],
    'Thrive': [
      {
        key: "Beginner's Path",
        title: "Beginner's Path",
        description:
          'Perfect for beginners - fresh juices with simple meals.',
        image: '/assets/hero/meal-starter.png',
      },
      {
        key: 'Premium Balance',
        title: 'Premium Balance',
        description: 'Advanced nutrition - curated juices and organic meals.',
        image: '/assets/hero/meal-premium.png',
      },
      {
        key: 'Elite Wellness',
        title: 'Elite Wellness',
        description:
          'Ultimate wellness - personalized juices and gourmet meals.',
        image: '/assets/hero/meal-elite.png',
      },
    ],
    'Our Story': [
      {
        key: 'default',
        title: 'Our Story',
        description: 'Committed to delivering the freshest beverages.',
        image: '/assets/hero/hero-1.png',
      },
    ],
  }

  const menuSubItems = {
    'Fresh Bar': ['All Blends', 'Detox Elixirs', 'Power Smoothies'],
    'Reset': ['Quick Reset', 'Deep Cleanse', 'Total Reboot'],
    'Thrive': ["Beginner's Path", 'Premium Balance', 'Elite Wellness'],
  }

  // Sticky category bar tabs - different for each menu
  const shopCategoriesByMenu = {
    'Fresh Bar': ['All Blends', 'Detox Elixirs', 'Power Smoothies', 'Protein Boost', 'Wellness Shots'],
    'Reset': ['All Programs', 'Juice Cleanses', 'Quick Reset', 'Deep Cleanse', 'Total Reboot'],
    'Thrive': ['All Plans', 'Daily Balance', 'Meal Delivery', 'Wellness Path'],
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

  // Scroll listener for compact category bar
  useEffect(() => {
    const handleScroll = () => {
      if (showLeftList) {
        const scrollY = window.scrollY
        // Activate compact mode after scrolling 500px
        setIsCompactMode(scrollY > 500)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showLeftList])

  // Reset to home page
  const handleLogoClick = () => {
    setActivePrimary('Home')
    setShowLeftList(false)
    setActiveShopItem(null)
    setIsHovered(false)
    setHoveredMenu(null)
    setActiveCategory('All Blends')
    setActiveFlavor(null)
    setShowFlavorCategories(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Called by Navbar on click
  const handlePrimaryChange = (key, openShop = false) => {
    // Trigger transition animation for menu navigation
    if (openShop && (key === 'Fresh Bar' || key === 'Reset' || key === 'Thrive')) {
      setTransitionColor(menuColors[key] || '#FF6B35')
      setShowTransition(true)
    }

    setActivePrimary(key)
    setActiveShopItem(null)
    setIsHovered(false)
    setHoveredMenu(null)
    setActiveFlavor(null)
    setShowFlavorCategories(false)

    if (openShop && (key === 'Fresh Bar' || key === 'Reset' || key === 'Thrive')) {
      // Open full shop section like Press London "Shop All" page
      setShowLeftList(true)
      setActiveCategory('All Blends')

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
  const currentCategories = shopCategoriesByMenu[activePrimary] || shopCategoriesByMenu['Fresh Bar']
  const currentMenuColor = menuColors[activePrimary] || '#FF6B35'

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Header - Overlays on hero images */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
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
        className="relative pt-[100px]"
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
      <section ref={shopSectionRef} className="bg-white">
        {showLeftList &&
          (activePrimary === 'Fresh Bar' ||
            activePrimary === 'Reset' ||
            activePrimary === 'Thrive') && (
            <>
              {/* Section Hero - Full-width background image */}
              <SectionHero
                title={sectionHeroConfig[activePrimary]?.title}
                subtitle={sectionHeroConfig[activePrimary]?.subtitle}
                backgroundImage={sectionHeroConfig[activePrimary]?.backgroundImage}
                menuColor={currentMenuColor}
                ctaText={sectionHeroConfig[activePrimary]?.ctaText}
                sectionKey={activePrimary}
                onCtaClick={() => {
                  // Scroll to product grid
                  setTimeout(() => {
                    const heroHeight = window.innerWidth >= 1024 ? 420 : window.innerWidth >= 768 ? 380 : window.innerWidth >= 640 ? 320 : 280
                    window.scrollTo({ 
                      top: shopSectionRef.current?.offsetTop + heroHeight - 100,
                      behavior: 'smooth' 
                    })
                  }, 100)
                }}
              />
              
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
                onCategoryChange={(category) => {
                  // Trigger transition for category changes (but not for "All" categories)
                  if (!category.includes('All')) {
                    setTransitionColor(currentMenuColor)
                    setShowTransition(true)
                  }
                  
                  setActiveCategory(category)
                  // If selecting Detox Elixirs or Power Smoothies, show flavor categories
                  if (category === 'Detox Elixirs' || category === 'Power Smoothies' || category === 'Protein Boost' || category === 'Wellness Shots') {
                    setShowFlavorCategories(true)
                    setActiveFlavor(null) // Reset flavor when entering flavor view
                  } else {
                    setShowFlavorCategories(false)
                    setActiveFlavor(null)
                  }
                }}
                menuColor={currentMenuColor}
                activeFlavor={activeFlavor}
                onFlavorChange={setActiveFlavor}
                showFlavorCategories={showFlavorCategories}
                products={products}
                isCompactMode={isCompactMode}
              />
              <ProductGrid
                products={products}
                activeCategory={activeCategory}
                activeFlavor={activeFlavor}
                showFlavorCategories={showFlavorCategories}
                title="Our Collection"
                menuColor={currentMenuColor}
                shopSectionRef={shopSectionRef}
                onViewAll={() => {
                  setActiveCategory('All Blends')
                  setActiveFlavor(null)
                  setShowFlavorCategories(false)
                  // Scroll to shop section top
                  setTimeout(() => {
                    shopSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }}
                onProductClick={(product) => setSelectedProduct(product)}
              />
            </>
          )}
      </section>

      {/* Health Journey Section - Only show on home page */}
      {!showLeftList && activePrimary === 'Home' && (
        <HealthJourney 
          onJourneyClick={(menuKey) => handlePrimaryChange(menuKey, true)}
        />
      )}

      {/* Additional Sections */}
      <ThreeBlocks />
      <WhySection />
      <Footer />

      {/* Cart Modal */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          menuColor={currentMenuColor}
        />
      )}

      {/* Page Transition Animation */}
      <PageTransition
        isActive={showTransition}
        color={transitionColor}
        onComplete={() => setShowTransition(false)}
      />
    </div>
  )
}