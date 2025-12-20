import { useState } from 'react'
import { sectionHeroGradients } from '../utils/sectionHeroConfig'

export default function SectionHero({ 
  title, 
  subtitle, 
  backgroundImage, 
  menuColor = '#FF6B35',
  onCtaClick,
  ctaText = 'Explore Collection',
  sectionKey // 'Fresh Bar', 'Reset', or 'Thrive'
}) {
  const [imageError, setImageError] = useState(false)
  
  // Use gradient fallback if image fails to load or doesn't exist
  const useGradient = imageError || !backgroundImage
  const gradientBackground = sectionKey ? sectionHeroGradients[sectionKey] : 'linear-gradient(135deg, #FF6B35 0%, #FFA500 100%)'
  
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden">
      {/* Background Image or Gradient */}
      {useGradient ? (
        <div 
          className="absolute inset-0"
          style={{ background: gradientBackground }}
        />
      ) : (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
            style={{ 
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Hidden img tag to detect loading errors */}
          <img 
            src={backgroundImage} 
            alt="" 
            className="hidden" 
            onError={() => setImageError(true)}
          />
        </>
      )}
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40" />
      
      {/* Additional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Decorative gradient accent */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${menuColor}40 0%, transparent 50%)`
        }}
      />
      
      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="max-w-4xl text-center">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl animate-fade-in">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-6 sm:mb-8 md:mb-10 leading-relaxed drop-shadow-lg animate-fade-in-delayed max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {/* CTA Button */}
          <button
            onClick={onCtaClick}
            className="group relative font-bold py-3 sm:py-4 px-8 sm:px-10 md:px-12 rounded-lg transition-all duration-300 text-base sm:text-lg shadow-2xl hover:shadow-3xl animate-fade-in-more-delayed text-white overflow-hidden transform hover:scale-105"
            style={{ backgroundColor: menuColor }}
          >
            {/* Button shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            
            {/* Button text */}
            <span className="relative flex items-center gap-2">
              {ctaText}
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      
      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 md:h-20">
        <svg 
          className="w-full h-full" 
          preserveAspectRatio="none" 
          viewBox="0 0 1440 120" 
          fill="none"
        >
          <path 
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" 
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}
