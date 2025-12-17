export default function ShopCategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
  menuColor = '#FF6B35',
}) {
  const categoryIcons = {
    All: '✨',
    Detox: '🧃',
    Smoothies: '🍹',
    Protein: '💪',
    Wellness: '🌿',
  };

  // Fall back to known categories if none are passed
  const categoryNames = (categories && categories.length > 0)
    ? categories
    : ['All', 'Detox', 'Smoothies', 'Protein', 'Wellness'];

  return (
    <>
      {/* Spacer to push content down from fixed header */}
      <div className="h-24"></div>

      {/* Sticky Category Icons Section */}
      <div
        className="sticky z-40 bg-gradient-to-b from-white via-white to-transparent shadow-lg"
        style={{ top: '160px' }}
      >
        <div className="w-full px-12 py-12 bg-white/95 backdrop-blur-sm">
          {/* Header with Benefits */}
          <div className="flex items-center justify-between mb-8">{/* Center Title */}
            <div className="flex-1 flex items-center justify-center gap-3">
              <span className="text-2xl">🍹</span>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                Shop by Category
              </span>
              <span className="text-2xl">🧃</span>
            </div>
            
            {/* Right Side Benefits */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden min-h-[140px]"
                style={{
                  borderColor: activeCategory === category ? menuColor : '#e0e0e0',
                  backgroundColor: activeCategory === category ? `${menuColor}15` : '#ffffff',
                  borderWidth: activeCategory === category ? '3px' : '2px',
                }}
              >
                {/* Background glow effect */}
                {activeCategory === category && (
                  <div 
                    className="absolute inset-0 opacity-20 blur-xl" 
                    style={{ backgroundColor: menuColor }}
                  />
                )}
                
                <span className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 relative z-10">
                  {categoryIcons[category] || '✨'}
                </span>
                <span 
                  className="text-base font-bold text-center relative z-10 transition-colors whitespace-nowrap"
                  style={{ 
                    color: activeCategory === category ? menuColor : '#333'
                  }}
                >
                  {category}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div 
          className="h-4 w-full" 
          style={{ 
            background: `linear-gradient(to bottom, ${menuColor}10, transparent)` 
          }}
        />
      </div>

      {/* Curved Wave Divider - BELOW Sticky Bar - LARGER */}
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
          fill={menuColor}
          fillOpacity="0.15"
          className="wave-curve"
        />
        <path
          d="M0,90 Q360,40 720,90 T1440,90 L1440,200 L0,200 Z"
          fill={menuColor}
          fillOpacity="0.10"
        />
        <path
          d="M0,120 Q360,60 720,120 T1440,120 L1440,200 L0,200 Z"
          fill={menuColor}
          fillOpacity="0.05"
        />
      </svg>

      {/* Gap spacer - After waves */}
      <div className="h-16 bg-white"></div>
    </>
  );
}