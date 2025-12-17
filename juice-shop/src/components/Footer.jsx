import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-textdark text-white mt-16">
      <div className="w-full px-8 sm:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
                Thiru
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-lime-400 to-yellow-400">
                Su
              </span>
              <span className="text-2xl">🍹</span>
            </h2>
            <p className="text-gray-400">
              Fresh, healthy, and delicious juices for your daily wellness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>hello@juiceshop.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>123 Main St, City, State</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            © 2025 Thirusu Juice Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}