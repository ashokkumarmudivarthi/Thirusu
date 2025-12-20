export default function ShopCategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
  menuColor = '#FF6B35',
  activeFlavor,
  onFlavorChange,
  showFlavorCategories = false,
  products = [],
  isCompactMode = false,
}) {
  const categoryIcons = {
    // Fresh Bar categories
    'All Blends': '🍹',
    'Detox Elixirs': '🥬',
    'Power Smoothies': '🍓',
    'Protein Boost': '💪',
    'Wellness Shots': '🌿',
    // Reset menu categories
    'All Programs': '📋',
    'Juice Cleanses': '🥤',
    'Quick Reset': '⚡',
    'Deep Cleanse': '🌊',
    'Total Reboot': '🔄',
    // Thrive menu categories
    'All Plans': '🎯',
    'Daily Balance': '⚖️',
    'Meal Delivery': '🍱',
    'Wellness Path': '🛤️',
  };

  // Flavor-specific fruit icons mapping
  // Can be easily replaced with imported SVG/PNG images:
  // import AppleIcon from '../assets/fruits/apple.svg'
  const flavorIcons = {
    'Apple': '🍎',
    'Kiwi': '🥝',
    'Orange': '🍊',
    'Watermelon': '🍉',
    'Grape': '🍇',
    'Pineapple': '🍍',
    'Mango': '🥭',
    'Strawberry': '🍓',
    'Blueberry': '🫐',
    'Banana': '🍌',
    'Peach': '🍑',
    'Lemon': '🍋',
    'Lime': '🍋',
    'Coconut': '🥥',
    'Avocado': '🥑',
    'Cherry': '🍒',
    'Pomegranate': '🫚',
    'Papaya': '🍈',
    // Fallback for any missing flavor
    'default': '🍊'
  };

  // Unique colors for each category
  const categoryColors = {
    // Fresh Bar categories
    'All Blends': '#6366f1', // Indigo
    'Detox Elixirs': '#10b981', // Green
    'Power Smoothies': '#f59e0b', // Orange
    'Protein Boost': '#ef4444', // Red
    'Wellness Shots': '#8b5cf6', // Purple
    // Reset menu categories
    'All Programs': '#6366f1',
    'Juice Cleanses': '#10b981',
    'Quick Reset': '#f59e0b',
    'Deep Cleanse': '#ec4899',
    'Total Reboot': '#8b5cf6',
    // Thrive menu categories
    'All Plans': '#6366f1',
    'Daily Balance': '#10b981',
    'Meal Delivery': '#f59e0b',
    'Wellness Path': '#ec4899',
  };

  // Get unique flavors from products based on active category
  const categoryMapping = {
    'Detox Elixirs': 'Detox',
    'Power Smoothies': 'Smoothies',
    'Protein Boost': 'Protein',
    'Wellness Shots': 'Wellness',
  };

  const mappedCategory = categoryMapping[activeCategory];
  
  const flavorOptions = mappedCategory
    ? [...new Set(products
        .filter(p => p.category === mappedCategory)
        .map(p => p.flavor)
      )]
    : [];

  // Fall back to known categories if none are passed
  const categoryNames = (categories && categories.length > 0)
    ? categories
    : ['All Blends', 'Detox Elixirs', 'Power Smoothies', 'Protein Boost', 'Wellness Shots'];

  // Get the color for active category or flavor
  const activeColor = showFlavorCategories && activeFlavor
    ? products.find(p => p.flavor === activeFlavor)?.flavorColor || categoryColors[activeCategory] || menuColor
    : categoryColors[activeCategory] || menuColor;

  return (
    <>
      {/* Sticky Category Icons Section */}
      <div className="sticky top-[100px] z-40 bg-white shadow-lg">
        <div className="w-full max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 py-12 bg-white/95 backdrop-blur-sm">
          {/* Header Row - Title and Info */}
          <div className="flex items-center justify-between mb-8">
            {/* Back Button - Show when in flavor view */}
            {showFlavorCategories && (
              <button
                onClick={() => {
                  onFlavorChange(null);
                  onCategoryChange('All Blends');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">←</span>
                <span className="text-sm font-semibold">Back to Categories</span>
              </button>
            )}
            
            {/* Center Title */}
            <div className={`flex-1 flex items-center justify-center gap-3 ${showFlavorCategories ? '' : ''}`}>
              <span className="text-2xl">🍹</span>
              <span className="text-xl font-bold transition-all duration-500" style={{ color: activeColor }}>
                {showFlavorCategories ? `${activeCategory} Flavors` : 'Shop by Category'}
              </span>
              <span className="text-2xl">🧃</span>
            </div>
            
            {/* Right Info */}
            <div className="hidden lg:flex flex-col gap-2 text-right">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">🚚</span>
                  <span className="font-semibold text-gray-700">Free Delivery</span>
                  <span className="text-gray-500">for boxes over ₹4000</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-orange-600">💝</span>
                  <span className="font-semibold text-gray-700">Subscribe</span>
                  <span className="text-gray-500">for up to 20% off</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-600">✓</span>
                  <span className="font-semibold text-gray-700">Cancel Anytime</span>
                </div>
              </div>
            </div>

          {/* Category Cards - Always Full Size */}
          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-3 max-w-7xl mx-auto px-4">
            {showFlavorCategories && flavorOptions.length > 0 ? (
                // Show flavor options
                flavorOptions.map((flavor) => {
                  const flavorColor = products.find(p => p.flavor === flavor)?.flavorColor || menuColor;
                  const isActive = activeFlavor === flavor;
                  
                  // Count products containing this fruit
                  const productCount = products.filter(p => {
                    if (p.fruitIngredients && Array.isArray(p.fruitIngredients)) {
                      return p.fruitIngredients.includes(flavor);
                    }
                    return p.flavor === flavor;
                  }).length;
                  
                  return (
                    <button
                      key={flavor}
                      onClick={() => onFlavorChange(flavor)}
                      className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-white border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 overflow-hidden flex-shrink-0"
                      style={{
                        width: '140px',
                        height: '90px',
                        borderColor: isActive ? flavorColor : '#e0e0e0',
                        backgroundColor: isActive ? `${flavorColor}15` : '#ffffff',
                        borderWidth: isActive ? '2.5px' : '2px',
                      }}
                    >
                      {/* Product Count Badge */}
                      {productCount > 0 && (
                        <div 
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white z-20 shadow-md"
                          style={{ backgroundColor: flavorColor }}
                        >
                          {productCount}
                        </div>
                      )}
                      
                      {/* Background glow effect */}
                      {isActive && (
                        <div 
                          className="absolute inset-0 opacity-15 blur-lg transition-all duration-300" 
                          style={{ backgroundColor: flavorColor }}
                        />
                      )}
                      
                      <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110 relative z-10">
                        {flavorIcons[flavor] || flavorIcons['default']}
                      </span>
                      <span 
                        className="text-sm font-bold text-center relative z-10 transition-colors duration-300"
                        style={{ 
                          color: isActive ? flavorColor : '#666'
                        }}
                      >
                        {flavor}
                      </span>

                      {/* Hover effect - show flavor color on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        style={{ backgroundColor: flavorColor }}
                      />
                    </button>
                  );
                })
              ) : (
                // Show regular categories
                categoryNames.map((category) => {
                  const categoryColor = categoryColors[category] || menuColor;
                  const isActive = activeCategory === category;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-white border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 overflow-hidden flex-shrink-0"
                      style={{
                        width: '140px',
                        height: '90px',
                        borderColor: isActive ? categoryColor : '#e0e0e0',
                        backgroundColor: isActive ? `${categoryColor}15` : '#ffffff',
                        borderWidth: isActive ? '2.5px' : '2px',
                      }}
                    >
                      {/* Background glow effect */}
                      {isActive && (
                        <div 
                          className="absolute inset-0 opacity-15 blur-lg transition-all duration-300" 
                          style={{ backgroundColor: categoryColor }}
                        />
                      )}
                      
                      <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110 relative z-10">
                        {categoryIcons[category] || '✨'}
                      </span>
                      <span 
                        className="text-sm font-bold text-center relative z-10 transition-colors duration-300"
                        style={{ 
                          color: isActive ? categoryColor : '#666'
                        }}
                      >
                        {category}
                      </span>

                      {/* Hover effect - show category color on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        style={{ backgroundColor: categoryColor }}
                      />
                    </button>
                  );
                })
              )}
            </div>
          
          {/* Bottom gradient fade */}
          <div 
            className="w-full h-4 mt-8"
            style={{ 
              background: `linear-gradient(to bottom, ${activeColor}10, transparent)` 
            }}
          />
        </div>
      </div>

      {/* Curved Wave Divider - BELOW Sticky Bar */}
      <svg
        viewBox="0 0 1440 200"
        className="w-full block"
        preserveAspectRatio="none"
        style={{ height: '160px', marginTop: '-1px' }}
      >
          <defs>
            <style>
              {`
                @keyframes waveBounce {
                  0%, 100% { d: path("M0,60 Q360,20 720,60 T1440,60 L1440,200 L0,200 Z"); }
                  50% { d: path("M0,80 Q360,30 720,80 T1440,80 L1440,200 L0,200 Z"); }
                }
                .wave-curve {
                  animation: waveBounce 4s ease-in-out infinite;
                }
              `}
            </style>
          </defs>

          <path
            d="M0,60 Q360,20 720,60 T1440,60 L1440,200 L0,200 Z"
            fill={activeColor}
            fillOpacity="0.15"
            className="wave-curve"
            style={{ transition: 'fill 0.5s ease' }}
          />
          <path
            d="M0,90 Q360,40 720,90 T1440,90 L1440,200 L0,200 Z"
            fill={activeColor}
            fillOpacity="0.10"
            style={{ transition: 'fill 0.5s ease' }}
          />
          <path
            d="M0,120 Q360,60 720,120 T1440,120 L1440,200 L0,200 Z"
            fill={activeColor}
            fillOpacity="0.05"
            style={{ transition: 'fill 0.5s ease' }}
          />
        </svg>

      {/* Gap spacer - After waves */}
      <div className="bg-white h-16"></div>
    </>
  );
}
