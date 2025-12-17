export default function HealthJourney() {
  const journeys = [
    {
      id: 1,
      title: 'Cleanses',
      image: '/assets/products/cleanses.png',
      description: 'Reset and rejuvenate with our cleanse programs',
    },
    {
      id: 2,
      title: 'Meal Plans',
      image: '/assets/products/meal-plans.png',
      description: 'Nutritious meals delivered to your door',
    },
    {
      id: 3,
      title: 'Shop Products',
      image: '/assets/products/shop-products.png',
      description: 'Fresh cold-pressed juices and wellness shots',
    },
  ]

  return (
    <section className="w-full py-20 bg-white">
      <div className="w-full px-8 sm:px-12 lg:px-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-4">
            Choose your health journey
          </h2>
          <p className="text-xl text-gray-600 italic">
            From short-term resets to long-term health goals, we've got you covered.
          </p>
        </div>

        {/* Three Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {journeys.map((journey) => (
            <div
              key={journey.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
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
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
