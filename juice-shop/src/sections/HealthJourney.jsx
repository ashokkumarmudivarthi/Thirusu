export default function HealthJourney({ onJourneyClick }) {
  const journeys = [
    {
      id: 1,
      title: 'Fresh Bar',
      menuKey: 'Fresh Bar',
      image: '/assets/products/shop-products.png',
      description: 'Fresh cold-pressed juices and wellness shots',
      color: '#FF6B35',
    },
    {
      id: 2,
      title: 'Reset',
      menuKey: 'Reset',
      image: '/assets/products/cleanses.png',
      description: 'Reset and rejuvenate with our cleanse programs',
      color: '#00A86B',
    },
    {
      id: 3,
      title: 'Thrive',
      menuKey: 'Thrive',
      image: '/assets/products/meal-plans.png',
      description: 'Nutritious meal plans delivered to your door',
      color: '#8B4513',
    },
  ]

  return (
    <section className="w-full py-24 bg-white">
      <div className="w-full px-8 sm:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 leading-tight">
            Choose your health journey
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 italic max-w-3xl mx-auto leading-relaxed">
            From short-term resets to long-term health goals, we've got you covered.
          </p>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-8 mb-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>
        </div>

        {/* Three Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-8">
          {journeys.map((journey) => (
            <div
              key={journey.id}
              onClick={() => onJourneyClick && onJourneyClick(journey.menuKey)}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={journey.image}
                  alt={journey.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay with Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-4xl font-serif font-light text-white mb-2">
                  {journey.title}
                </h3>
                <p className="text-white/90 text-sm">
                  {journey.description}
                </p>
                
                {/* Click indicator */}
                <div 
                  className="mt-4 inline-flex items-center gap-2 text-white/90 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: journey.color }}
                >
                  Explore Now →
                </div>
              </div>

              {/* Hover Effect */}
              <div 
                className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 transition-all duration-300 pointer-events-none"
                style={{ borderColor: `${journey.color}30` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
