import { useParams } from 'react-router-dom'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { products } from '../utils/products'

export default function Product() {
  const { id } = useParams()
  const product = products.find((p) => p.id === parseInt(id))

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold text-textdark">Product not found</h1>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-bgsoft min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-white rounded-lg p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-textdark mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{product.short}</p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-5xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.long}
            </p>

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="px-4 py-2 text-textdark">−</button>
                <span className="px-6 py-2 border-l border-r border-gray-300">1</span>
                <button className="px-4 py-2 text-textdark">+</button>
              </div>
              <button className="flex-1 bg-primary hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-4">
              <button className="flex-1 border-2 border-primary text-primary hover:bg-bgsoft font-bold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2">
                <Heart size={20} />
                Wishlist
              </button>
              <button className="flex-1 border-2 border-gray-300 text-textdark hover:bg-white font-bold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2">
                <Share2 size={20} />
                Share
              </button>
            </div>

            {/* Info */}
            <div className="mt-12 border-t border-gray-300 pt-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-textdark font-semibold">Category:</span>
                <span className="text-gray-600">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textdark font-semibold">SKU:</span>
                <span className="text-gray-600">JS-{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textdark font-semibold">Availability:</span>
                <span className="text-accent font-semibold">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}