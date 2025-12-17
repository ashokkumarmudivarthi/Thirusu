import ProductCard from '../components/ProductCard'

export default function ProductGrid({
  products,
  activeCategory,
  menuColor = '#FF6B35',
}) {
  const getBackgroundColor = (hexColor) => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, 0.02)`
  }

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() === activeCategory.toLowerCase()
        )

  return (
    <>
      {/* Gap/Spacer */}
      <div className="h-8 bg-white"></div>

      {/* Products Section */}
      <section 
        className="w-full px-12 py-16 bg-white transition-colors duration-300 relative overflow-hidden"
        style={{ backgroundColor: getBackgroundColor(menuColor) }}
      >
        {/* Animated background bubbles */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: menuColor }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: menuColor }}></div>

        <div className="max-w-full mx-auto relative z-10">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} menuColor={menuColor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">
                No products found in this category.
              </p>
            </div>
          )}

          {/* Unique Attractive Button */}
          <div className="flex justify-center items-center mt-12">
            <button 
              className="relative px-10 py-4 text-white font-bold text-lg rounded-lg overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: menuColor }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="absolute inset-0 rounded-lg" style={{ border: `2px solid ${menuColor}`, boxShadow: `0 0 20px ${menuColor}60` }}></span>
              <span className="relative flex items-center gap-3">
                View All Products
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Floating Bubbles Bottom Divider - Option 2 */}
        <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden">
          {/* Bubble 1 */}
          <div 
            className="absolute bottom-8 left-10 w-12 h-12 rounded-full opacity-30 animate-bounce-float"
            style={{ backgroundColor: menuColor, animationDelay: '0s' }}
          ></div>
          
          {/* Bubble 2 */}
          <div 
            className="absolute bottom-12 left-32 w-8 h-8 rounded-full opacity-25 animate-bounce-float"
            style={{ backgroundColor: menuColor, animationDelay: '0.3s' }}
          ></div>
          
          {/* Bubble 3 */}
          <div 
            className="absolute bottom-10 left-1/3 w-10 h-10 rounded-full opacity-28 animate-bounce-float"
            style={{ backgroundColor: menuColor, animationDelay: '0.6s' }}
          ></div>
          
          {/* Bubble 4 */}
          <div 
            className="absolute bottom-16 left-1/2 w-6 h-6 rounded-full opacity-24 animate-bounce-float"
            style={{ backgroundColor: menuColor, animationDelay: '0.9s' }}
          ></div>
          
          {/* Bubble 5 */}
          <div 
            className="absolute bottom-8 right-32 w-9 h-9 rounded-full opacity-26 animate-bounce-float"
            style={{ backgroundColor: menuColor, animationDelay: '1.2s' }}
          ></div>
          
          {/* Bubble 6 */}
          <div 
            className="absolute bottom-12 right-10 w-7 h-7 rounded-full opacity-27 animate-bounce-float"
            style={{ backgroundColor: menuColor, animationDelay: '1.5s' }}
          ></div>

          {/* Curved background */}
          <svg viewBox="0 0 1440 120" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none">
            <path
              d="M0,60 Q360,20 720,60 T1440,60 L1440,120 L0,120 Z"
              fill={menuColor}
              fillOpacity="0.05"
            />
          </svg>
        </div>
      </section>
    </>
  )
}