import { Heart, Users, Truck, Star, Award, Shield } from 'lucide-react'

export default function WhySection() {
  const features = [
    {
      id: 1,
      icon: Heart,
      title: 'Made with Love',
      description: 'Each bottle is crafted with care and passion for your wellness.',
      color: '#FF6B35',
      stat: '100%',
      statLabel: 'Handcrafted',
    },
    {
      id: 2,
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of happy customers who have made juice part of their routine.',
      color: '#00A86B',
      stat: '10k+',
      statLabel: 'Happy Customers',
    },
    {
      id: 3,
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Fresh juice delivered to your door within 24 hours of ordering.',
      color: '#8B4513',
      stat: '24h',
      statLabel: 'Delivery',
    },
  ]

  const badges = [
    { icon: Award, label: 'Premium Quality' },
    { icon: Shield, label: 'Safe & Secure' },
    { icon: Star, label: '4.9★ Rated' },
  ]

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full px-8 sm:px-12 lg:px-20 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 leading-tight">
            Why Choose Us
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-8">
            More than just juice – we're your partner in wellness
          </p>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {badges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <div 
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100"
                >
                  <Icon size={18} className="text-orange-600" />
                  <span className="text-sm font-semibold text-gray-700">{badge.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 -mt-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className="group relative bg-white rounded-3xl p-12 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-6 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${feature.color}, transparent)` }}
                ></div>

                {/* Icon with Animation */}
                <div className="relative mb-6">
                  <div className="flex justify-center">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 relative"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon size={40} style={{ color: feature.color }} className="group-hover:scale-110 transition-transform duration-300" />
                      
                      {/* Rotating Ring */}
                      <div 
                        className="absolute inset-0 rounded-full border-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"
                        style={{ borderColor: `${feature.color}30`, borderTopColor: feature.color }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 
                    className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300"
                    style={{ color: feature.color }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Stat Badge */}
                  <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
                    <div className="text-3xl font-bold" style={{ color: feature.color }}>
                      {feature.stat}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                      {feature.statLabel}
                    </div>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: feature.color }}
                ></div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-50 via-green-50 to-amber-50 rounded-2xl p-12 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start your wellness journey?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community and experience the difference of premium, cold-pressed nutrition
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Shop Now
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for slow spin */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  )
}