import { bannerConfig } from '../utils/bannerConfig';

export default function SectionBanner({ 
  category, 
  menuColor = '#FF6B35',
  title,
  subtitle,
  ctaText = 'Explore Now',
  onCtaClick,
  showCta = true 
}) {
  // Get banner configuration
  const config = bannerConfig[category] || {};
  const backgroundImage = config.image;
  const fallbackGradient = config.gradient || `linear-gradient(135deg, ${menuColor} 0%, ${menuColor}dd 100%)`;
  const patternOverlay = config.pattern || '';
  const emojiDecor = config.emoji || '✨';

  // Auto-generate title and subtitle if not provided
  const displayTitle = title || category;
  const displaySubtitle = subtitle || getDefaultSubtitle(category);

  function getDefaultSubtitle(cat) {
    const subtitles = {
      'All Blends': 'Discover our complete collection of fresh juices & smoothies',
      'Detox Elixirs': 'Pure, cold-pressed juices for natural cleansing',
      'Power Smoothies': 'Energy-packed smoothies with premium ingredients',
      'Protein Boost': 'High-protein shakes for fitness & recovery',
      'Wellness Shots': 'Concentrated immunity & wellness boosters',
      'All Programs': 'Complete cleanse programs for your wellness journey',
      'Juice Cleanses': 'Multi-day juice cleanse packages',
      'Quick Reset': 'Fast-track cleanse programs (2-3 days)',
      'Deep Cleanse': 'Intensive 5-day detox programs',
      'Total Reboot': 'Complete 7-14 day transformation',
      'All Plans': 'Comprehensive meal & wellness plans',
      'Daily Balance': 'Beginner-friendly nutrition plans',
      'Meal Delivery': 'Chef-prepared meals delivered fresh',
      'Wellness Path': 'Premium personalized wellness programs',
    };
    return subtitles[cat] || 'Explore our premium selection';
  }

  return (
    <section className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
      {/* Background Image with Fallback Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${backgroundImage})` 
            : fallbackGradient,
        }}
      >
        {/* Pattern Layer */}
        {patternOverlay && (
          <div 
            className="absolute inset-0"
            style={{ backgroundImage: patternOverlay }}
          />
        )}
        
        {/* Animated Gradient Overlay - creates depth and movement */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(135deg, ${menuColor}99 0%, ${menuColor}33 50%, transparent 100%)`,
          }}
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent" />
        
        {/* Dot Pattern Overlay for texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${menuColor} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Fruit Elements - Decorative */}
      <div className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-20 blur-2xl animate-float" style={{ backgroundColor: menuColor }} />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-15 blur-3xl animate-float-delayed" style={{ backgroundColor: menuColor }} />
      
      {/* Emoji Decorations */}
      <div className="absolute top-8 left-12 text-6xl opacity-20 animate-float">
        {emojiDecor.split('')[0]}
      </div>
      <div className="absolute bottom-12 right-16 text-5xl opacity-15 animate-float-delayed">
        {emojiDecor.split('')[1] || emojiDecor.split('')[0]}
      </div>
      <div className="absolute top-1/2 right-8 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        {emojiDecor.split('')[2] || emojiDecor.split('')[0]}
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 sm:px-12 lg:px-20 text-center">
        {/* Category Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-sm shadow-lg"
          style={{ 
            backgroundColor: `${menuColor}20`,
            border: `2px solid ${menuColor}60`,
          }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: menuColor }} />
          <span className="text-sm font-bold tracking-wide text-white">PREMIUM SELECTION</span>
        </div>

        {/* Main Title */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 text-white drop-shadow-2xl leading-tight"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
          {displayTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-8 drop-shadow-lg font-medium">
          {displaySubtitle}
        </p>

        {/* CTA Button */}
        {showCta && (
          <button
            onClick={onCtaClick}
            className="group relative px-8 py-4 rounded-full font-bold text-lg text-white overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
            style={{ backgroundColor: menuColor }}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            
            {/* Button content */}
            <span className="relative flex items-center gap-2">
              {ctaText}
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>

            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
              style={{ backgroundColor: menuColor }}
            />
          </button>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 sm:h-16"
          style={{ fill: '#ffffff' }}
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7L1248,53L1248,120L1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
