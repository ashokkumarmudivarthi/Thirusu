export default function HeroShowcase({
  activePrimary,
  activeShopItem,
  onMenuItemChange,
  heroConfigs,
  showLeftList,
  isHovered,
  hoveredMenu,
  menuSubItems,
  currentMenuColor,
  currentHeroIndex = 0,
}) {
  const currentConfig = heroConfigs[activePrimary] || []
  const currentHero = activePrimary === 'Home' ? currentConfig[currentHeroIndex] : currentConfig[0]
  const currentSubItems = menuSubItems[hoveredMenu] || []

  // Helper function to convert hex color to light tinted background
  const getBackgroundColor = (hexColor) => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, 0.08)`
  }

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {showLeftList && (activePrimary === 'Shop' || activePrimary === 'Cleanses' || activePrimary === 'Meal Plans') ? (
        // CLICK STATE - Just a spacer, actual shop content is in the section below
        <div className="w-full h-0"></div>
      ) : (
        // Default Hero
        <div className="relative w-full h-[90vh]">
          <img
            src={currentHero?.image}
            alt={currentHero?.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/15"></div>

          {/* Hero Content */}
          <div className={`absolute inset-0 flex items-center ${
            activePrimary === 'Home' 
              ? 'justify-center' 
              : 'px-12 md:px-20 lg:px-32'
          }`}>
            <div className={`max-w-2xl ${
              activePrimary === 'Home' 
                ? 'text-center' 
                : 'text-left'
            }`}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight fade-in">
                {currentHero?.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed fade-in">
                {currentHero?.description}
              </p>
              <button className="font-bold py-4 px-10 rounded-lg transition-all duration-200 text-lg shadow-lg hover:shadow-xl fade-in text-white"
                style={{ backgroundColor: currentMenuColor }}>
                Explore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}