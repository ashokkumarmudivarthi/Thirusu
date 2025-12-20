// Section hero configurations for Fresh Bar, Reset, and Thrive menus
// Each section displays a full-width hero when the menu is active

export const sectionHeroConfig = {
  'Fresh Bar': {
    title: 'All Fresh Blends',
    subtitle: 'Discover our complete collection of fresh, cold-pressed juices crafted for your wellness.',
    backgroundImage: '/assets/hero/fresh-bar-hero.jpg',
    ctaText: 'Explore Fresh Blends'
  },
  'Reset': {
    title: 'Reset Programs',
    subtitle: 'Transform your body with our expertly designed juice cleanse programs.',
    backgroundImage: '/assets/hero/reset-hero.jpg',
    ctaText: 'Start Your Reset'
  },
  'Thrive': {
    title: 'Thrive Plans',
    subtitle: 'Personalized nutrition plans combining fresh juices with wholesome meals for ultimate wellness.',
    backgroundImage: '/assets/hero/thrive-hero.jpg',
    ctaText: 'Discover Your Plan'
  }
}

// Fallback gradient backgrounds if images are not available
export const sectionHeroGradients = {
  'Fresh Bar': 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFA500 100%)',
  'Reset': 'linear-gradient(135deg, #00A86B 0%, #20B2AA 50%, #48D1CC 100%)',
  'Thrive': 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)'
}
