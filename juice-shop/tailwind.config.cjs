module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        accent: '#00A86B',
        bgsoft: '#FFF7F0',
        textdark: '#222222',
        'shop-color': '#FF6B35',
        'cleanses-color': '#00A86B',
        'meals-color': '#8B4513',
        'about-color': '#4169E1',
      },
      spacing: {
        '128': '32rem',
      },
      fontSize: {
        '7xl': '5rem',
      },
      boxShadow: {
        'wave': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        wave: {
          '0%': { d: 'path("M0,50 Q250,25 500,50 T1000,50 T1500,50 L1500,120 L0,120 Z")' },
          '50%': { d: 'path("M0,30 Q250,60 500,30 T1000,30 T1500,30 L1500,120 L0,120 Z")' },
          '100%': { d: 'path("M0,50 Q250,25 500,50 T1000,50 T1500,50 L1500,120 L0,120 Z")' },
        },
        'wave-bottom': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'float-bubble': {
          '0%': { transform: 'translateY(0px)', opacity: '0.6' },
          '50%': { transform: 'translateY(-20px)', opacity: '0.8' },
          '100%': { transform: 'translateY(0px)', opacity: '0.6' },
        },
        'bounce-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 107, 53, 0.8)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fade-in 0.5s ease-in',
        'scroll-left': 'scroll-left 20s linear infinite',
        wave: 'wave 4s ease-in-out infinite',
        'wave-bottom': 'wave-bottom 3s ease-in-out infinite',
        'float-bubble': 'float-bubble 3s ease-in-out infinite',
        'bounce-float': 'bounce-float 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}