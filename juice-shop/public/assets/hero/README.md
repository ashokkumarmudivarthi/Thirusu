# Section Banner Images

This directory contains full-width hero banner images for each product section category.

## Image Specifications

- **Recommended Size**: 1920px × 400px (or higher resolution for retina displays)
- **Aspect Ratio**: 16:3 to 16:4
- **Format**: JPG (for photos) or WebP (for better compression)
- **File Size**: Optimize to < 200KB each for performance

## Required Banner Images

### Fresh Bar Section
1. **all-blends.jpg** - Colorful juice bottles/fruits collage
2. **detox-elixirs.jpg** - Green vegetables and cleansing ingredients
3. **power-smoothies.jpg** - Energetic fruits and superfoods
4. **protein-boost.jpg** - Protein-rich ingredients (nuts, seeds, protein powder)
5. **wellness-shots.jpg** - Small shot glasses with concentrated juices

### Reset Section
6. **all-programs.jpg** - Organized juice cleanse packages
7. **juice-cleanses.jpg** - Fresh pressed juices in bottles
8. **quick-reset.jpg** - Quick refresh imagery with citrus
9. **deep-cleanse.jpg** - Deep green detox ingredients
10. **total-reboot.jpg** - Complete transformation imagery

### Thrive Section
11. **all-plans.jpg** - Meal prep containers with fresh juices
12. **daily-balance.jpg** - Balanced nutrition imagery
13. **meal-delivery.jpg** - Delivery boxes with fresh ingredients
14. **wellness-path.jpg** - Holistic wellness journey imagery

## Current Fallback System

If banner images are not available, the system automatically uses rich gradient backgrounds defined in `/src/utils/bannerConfig.js`. Each category has:
- 3-stop linear gradient
- Radial pattern overlay
- Emoji decorations
- Dark overlay for text contrast

## Adding New Images

1. Place optimized images in this directory
2. Image paths are already configured in `/src/utils/bannerConfig.js`
3. No code changes needed - images will automatically replace gradient fallbacks

## Image Guidelines

- **Style**: Bright, fresh, appetizing food photography
- **Composition**: Leave space in center for title text (add overlay in Photoshop if needed)
- **Colors**: Match menu color themes (Fresh Bar: orange, Reset: green, Thrive: purple)
- **Quality**: Professional product photography preferred
- **Consistency**: Maintain similar lighting and style across all images

## Resources

- Use Unsplash, Pexels, or custom product photography
- Consider adding subtle overlay in image editor for better text readability
- Test images at different screen sizes (mobile to 4K desktop)
