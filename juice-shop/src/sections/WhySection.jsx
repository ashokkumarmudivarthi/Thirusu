import { Heart, Users, Truck } from 'lucide-react'

export default function WhySection() {
  const features = [
    {
      id: 1,
      icon: Heart,
      title: 'Made with Love',
      description: 'Each bottle is crafted with care and passion for your wellness.',
    },
    {
      id: 2,
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of happy customers who have made juice part of their routine.',
    },
    {
      id: 3,
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Fresh juice delivered to your door within 24 hours of ordering.',
    },
  ]

  return (
    <section className="bg-bgsoft py-16">
      <div className="w-full px-8 sm:px-12 lg:px-20">
        <h2 className="text-4xl font-bold text-textdark text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-center mb-4">
                  <Icon size={48} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-textdark mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}