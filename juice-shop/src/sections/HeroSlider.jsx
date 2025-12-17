import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Search, Heart, User, ShoppingCart } from 'lucide-react'

export default function HeroSlider({ activeMenu, onMenuHover, onShopClick }) {
  const [isOpen, setIsOpen] = useState(false)

  const heroSections = [
    {
      key: 'Shop',
      title: 'Fresh Juices & Smoothies',
      description: 'Discover our collection of cold-pressed, organic juices crafted for your wellness.',
      image: '/assets/hero/hero-1.svg',
      cta: 'Shop Now',
    },
    {
      key: 'Cleanses',
      title: 'Juice Cleanses',
      description: 'Reset your body with our 3, 5, or 7-day cleanse programs designed by nutritionists.',
      image: '/assets/hero/hero-2.svg',
      cta: 'Start Cleanse',
    },
    {
      key: 'Meal Plans',
      title: 'Custom Meal Plans',
      description: 'Personalized nutrition plans combining fresh juices with wholesome meals.',
      image: '/assets/hero/hero-3.svg',
      cta: 'Explore Plans',
    },
    {
      key: 'About Us',
      title: 'Our Story',
      description: "Since 2015, we've been committed to delivering the freshest, most nutritious beverages.",
      image: '/assets/hero/hero-1.svg',
      cta: 'Learn More',
    },
  ]

  const currentHero = heroSections.find((section) => section.key === activeMenu)

  const menuItems = [
    { label: 'Shop', key: 'Shop' },
    { label: 'Cleanses', key: 'Cleanses' },
    { label: 'Meal Plans', key: 'Meal Plans' },
    { label: 'About Us', key: 'About Us' },
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Hero Background Image */}
      {currentHero && (
        <div className="absolute inset-0">
          <img
            src={currentHero.image}
            alt={currentHero.key}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      {/* Main Menu Bar */}
      <nav className="absolute top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="w-full px-12 py-6">
          <div className="flex justify-between items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-primary tracking-tight whitespace-nowrap">
                🍹 Juice
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-16 flex-1">
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  onMouseEnter={() => onMenuHover(item.key)}
                  className="relative group"
                >
                  <button
                    onClick={() => item.key === 'Shop' && onShopClick()}
                    className={`text-sm font-medium transition-all duration-200 pb-2 border-b-2 ${
                      activeMenu === item.key
                        ? 'text-primary border-primary'
                        : 'text-textdark border-transparent hover:text-primary hover:border-primary'
                    }`}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-10">
              <button className="text-textdark hover:text-primary transition-colors duration-200 p-1">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button className="text-textdark hover:text-primary transition-colors duration-200 p-1">
                <Heart size={20} strokeWidth={1.5} />
              </button>
              <button className="text-textdark hover:text-primary transition-colors duration-200 p-1">
                <User size={20} strokeWidth={1.5} />
              </button>
              <button className="relative text-textdark hover:text-primary transition-colors duration-200 p-1">
                <ShoppingCart size={20} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-textdark hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X size={24} strokeWidth={1.5} />
              ) : (
                <Menu size={24} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-gray-200 pt-4">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onMenuHover(item.key)
                    if (item.key === 'Shop') onShopClick()
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded transition-all ${
                    activeMenu === item.key
                      ? 'bg-primary text-white'
                      : 'text-textdark hover:bg-bgsoft'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-30 h-full flex items-center px-12 md:px-20 lg:px-32">
        <div className="max-w-2xl text-left">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight fade-in">
            {currentHero?.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed fade-in">
            {currentHero?.description}
          </p>
          <button
            onClick={onShopClick}
            className="bg-primary hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl fade-in"
          >
            {currentHero?.cta}
          </button>
        </div>
      </div>
    </div>
  )
}