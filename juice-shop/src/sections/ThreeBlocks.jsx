import { Zap, Leaf, Target } from 'lucide-react'

export default function ThreeBlocks() {
  const blocks = [
    {
      id: 1,
      icon: Leaf,
      title: 'Organic Ingredients',
      description: 'All our juices are made from 100% organic, locally-sourced ingredients.',
      color: 'accent',
    },
    {
      id: 2,
      icon: Zap,
      title: 'Maximum Nutrition',
      description: 'Cold-pressed to retain maximum vitamins, minerals, and enzymes.',
      color: 'primary',
    },
    {
      id: 3,
      icon: Target,
      title: 'Zero Additives',
      description: 'No added sugar, preservatives, or artificial flavors. Pure juice.',
      color: 'accent',
    },
  ]

  return (
    <section className="w-full px-8 sm:px-12 lg:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blocks.map((block) => {
          const Icon = block.icon
          const bgColor = block.color === 'primary' ? 'bg-primary' : 'bg-accent'
          return (
            <div
              key={block.id}
              className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition"
            >
              <div
                className={`${bgColor} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-textdark mb-2">
                {block.title}
              </h3>
              <p className="text-gray-600">{block.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}