import { Zap, Leaf, Target, Sparkles } from 'lucide-react'

export default function ThreeBlocks() {
  const blocks = [
    {
      id: 1,
      icon: Leaf,
      title: 'Organic Ingredients',
      description: 'All our juices are made from 100% organic, locally-sourced ingredients.',
      color: '#00A86B',
      gradient: 'from-green-50 to-emerald-50',
    },
    {
      id: 2,
      icon: Zap,
      title: 'Maximum Nutrition',
      description: 'Cold-pressed to retain maximum vitamins, minerals, and enzymes.',
      color: '#FF6B35',
      gradient: 'from-orange-50 to-amber-50',
    },
    {
      id: 3,
      icon: Target,
      title: 'Zero Additives',
      description: 'No added sugar, preservatives, or artificial flavors. Pure juice.',
      color: '#8B4513',
      gradient: 'from-amber-50 to-yellow-50',
    },
  ]

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full px-8 sm:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
            <Sparkles size={20} className="text-orange-600" />
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Our Promise</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 leading-tight">
            Pure. Fresh. Natural.
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Every bottle tells a story of quality, care, and commitment to your wellness
          </p>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-8 mb-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>
        </div>

        {/* Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-8">
          {blocks.map((block, index) => {
            const Icon = block.icon
            return (
              <div
                key={block.id}
                className="group relative bg-white rounded-3xl p-10 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden border border-gray-100"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${block.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Decorative Circle */}
                <div 
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-150"
                  style={{ backgroundColor: block.color }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: block.color }}
                    >
                      <Icon size={36} className="text-white" />
                    </div>
                    {/* Pulse Effect */}
                    <div 
                      className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"
                      style={{ backgroundColor: `${block.color}40` }}
                    ></div>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:scale-105 transition-transform duration-300"
                    style={{ color: block.color }}
                  >
                    {block.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center leading-relaxed">
                    {block.description}
                  </p>

                  {/* Bottom Accent Line */}
                  <div className="mt-6 h-1 w-0 group-hover:w-full mx-auto rounded-full transition-all duration-500" style={{ backgroundColor: block.color }}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center pt-12 border-t border-gray-200">
          <div className="p-6">
            <div className="text-5xl font-bold text-orange-600 mb-3">100%</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Organic</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-green-600 mb-3">0</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Additives</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-blue-600 mb-3">24h</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Fresh</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-bold text-purple-600 mb-3">∞</div>
            <div className="text-gray-600 text-sm uppercase tracking-wide">Benefits</div>
          </div>
        </div>
      </div>
    </section>
  )
}