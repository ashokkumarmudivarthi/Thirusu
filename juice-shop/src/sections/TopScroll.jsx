import { useState, useEffect } from 'react'
import api from '../services/api'

export default function TopScroll() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers/active')
      setOffers(response.data)
    } catch (error) {
      console.error('Error fetching offers:', error)
      // Fallback to default offers if API fails
      setOffers([
        { id: 1, text: 'FREE SHIPPING ON ORDERS OVER $50', icon: '🎉' },
        { id: 2, text: 'FRESH COLD-PRESSED DAILY', icon: '🍹' },
        { id: 3, text: '100% ORGANIC INGREDIENTS', icon: '💚' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading || offers.length === 0) {
    return null
  }

  // Format offers for display
  const offerText = offers
    .map(offer => `${offer.icon || ''} ${offer.text}`)
    .join(' • ')

  return (
    <div className="w-full overflow-hidden border-b-2 border-yellow-500" style={{ background: 'linear-gradient(90deg, #1a1a1a 0%, #ff6b35 50%, #ffd700 100%)', minHeight: '60px', paddingTop: '16px', paddingBottom: '16px', opacity: 1 }}>
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="inline-block px-8 text-base font-bold tracking-wide text-white">
          {offerText} •
        </span>
        <span className="inline-block px-8 text-base font-bold tracking-wide text-white">
          {offerText} •
        </span>
      </div>
    </div>
  )
}
