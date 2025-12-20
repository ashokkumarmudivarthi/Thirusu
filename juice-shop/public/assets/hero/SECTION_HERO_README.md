# Section Hero Background Images

This directory contains hero-style background images for each main menu section.

## Required Images

### 1. Fresh Bar Hero
**Filename:** `fresh-bar-hero.jpg`
- **Theme:** Colorful fresh fruit juices and bottles
- **Mood:** Vibrant, energetic, refreshing
- **Colors:** Orange, yellow, red tones (matching #FF6B35)
- **Suggested Content:** 
  - Assorted fresh juices in bottles
  - Fresh fruits (oranges, strawberries, mangoes)
  - Bright, appetizing composition
  
### 2. Reset Hero
**Filename:** `reset-hero.jpg`
- **Theme:** Detox and cleansing imagery
- **Mood:** Clean, fresh, rejuvenating
- **Colors:** Green, teal, mint tones (matching #00A86B)
- **Suggested Content:**
  - Green detox juices
  - Leafy greens, cucumbers, celery
  - Spa/wellness aesthetic
  
### 3. Thrive Hero
**Filename:** `thrive-hero.jpg`
- **Theme:** Wellness lifestyle and nutrition
- **Mood:** Premium, wholesome, balanced
- **Colors:** Brown, earth tones, gold (matching #8B4513)
- **Suggested Content:**
  - Meal prep with fresh ingredients
  - Balanced nutrition display
  - Lifestyle/wellness imagery

## Image Specifications

- **Dimensions:** 1920px × 450px minimum (recommended: 2400px × 600px for retina)
- **Aspect Ratio:** 16:4 to 16:3.5
- **Format:** JPG (compressed for web)
- **File Size:** Optimize to < 300KB each
- **Quality:** High resolution, professional photography
- **Composition:** Leave center space clear for overlay text

## Overlay Guidelines

The component automatically adds:
- **Gradient overlay:** 60% black gradient (left to right, 60-40% opacity)
- **Dark overlay:** 20% additional black overlay
- **Color accent:** 30% opacity gradient in menu color
- **Result:** Ensures white text is readable on any background

## Technical Requirements

1. **Text Safety Zone:** Keep important visual elements away from center 60% where text appears
2. **Contrast:** Images should have medium to dark tones for optimal text readability
3. **Focus:** Main subject should be in upper 2/3 of image (bottom has wave divider)
4. **Responsive:** Image will be cropped on mobile - keep key elements centered

## Current Fallback

If hero images are not available, the system uses gradient backgrounds defined in `/src/utils/sectionHeroConfig.js`:
- **Fresh Bar:** Orange gradient (#FF6B35 → #FFA500)
- **Reset:** Green gradient (#00A86B → #48D1CC)
- **Thrive:** Brown gradient (#8B4513 → #CD853F)

## Adding Images

1. Place optimized images in this directory with exact filenames above
2. Images will automatically be used (no code changes needed)
3. Test on mobile, tablet, and desktop to verify composition

## Resources

- **Unsplash Collections:** Search for "fresh juice", "detox", "wellness meal prep"
- **Pexels:** Search for "cold pressed juice", "green smoothie", "healthy lifestyle"
- **Custom Photography:** Professional product shots recommended for best results
- **Tools:** Use Photoshop/GIMP to add subtle vignette if needed for text contrast

## Responsive Heights

- Mobile (< 640px): 280px
- Tablet (640-768px): 320px  
- Desktop (768-1024px): 380px
- Large Desktop (> 1024px): 420px
