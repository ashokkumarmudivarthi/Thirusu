export default function TopScroll() {
  return (
    <div className="w-full overflow-hidden border-b-2 border-yellow-500" style={{ background: 'linear-gradient(90deg, #1a1a1a 0%, #ff6b35 50%, #ffd700 100%)', minHeight: '60px', paddingTop: '16px', paddingBottom: '16px', opacity: 1 }}>
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="inline-block px-8 text-base font-bold tracking-wide text-white">
          🎉 FREE SHIPPING ON ORDERS OVER $50 • 🍹 FRESH COLD-PRESSED DAILY • 💚 100% ORGANIC INGREDIENTS • ⚡ LIMITED TIME: 20% OFF YOUR FIRST ORDER • 🎁 SUBSCRIBE & SAVE UP TO 25% • 🚀 SAME DAY DELIVERY AVAILABLE • 🌟 NEW FLAVORS EVERY WEEK •
        </span>
        <span className="inline-block px-8 text-base font-bold tracking-wide text-white">
          🎉 FREE SHIPPING ON ORDERS OVER $50 • 🍹 FRESH COLD-PRESSED DAILY • 💚 100% ORGANIC INGREDIENTS • ⚡ LIMITED TIME: 20% OFF YOUR FIRST ORDER • 🎁 SUBSCRIBE & SAVE UP TO 25% • 🚀 SAME DAY DELIVERY AVAILABLE • 🌟 NEW FLAVORS EVERY WEEK •
        </span>
      </div>
    </div>
  )
}