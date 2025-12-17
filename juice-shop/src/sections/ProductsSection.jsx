import ProductCard from '../components/ProductCard'

export default function ProductsSection({ products, title = 'Featured Products' }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-textdark text-center mb-12">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.slice(0, 9).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-primary hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition">
          View All Products
        </button>
      </div>
    </section>
  )
}