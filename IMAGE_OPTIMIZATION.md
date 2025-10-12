# Image Optimization Guide

## Current Issue
Portfolio images (especially artwork) are very large (1.5MB+), causing slow page loads.

## Solution Options

### Option 1: Manual Optimization (Recommended for Now)

Use online tools to manually optimize images:

1. **TinyPNG** (https://tinypng.com/)
   - Upload JPG/PNG files
   - Automatically compresses with minimal quality loss
   - Download optimized versions

2. **Squoosh** (https://squoosh.app/)
   - More control over compression settings
   - Can create multiple sizes
   - Progressive JPEG support

**Recommended sizes for portfolio:**
- **Thumbnails** (for cards): 800px wide, 80% quality → ~50-100KB
- **Medium** (for galleries): 1200px wide, 85% quality → ~150-300KB
- **Large** (for lightbox): 1920px wide, 90% quality → ~300-500KB

### Option 2: Automated Script (When Sharp Works)

The `frontend/scripts/optimize-images.js` script is ready to use when Sharp is properly installed.

To fix Sharp installation on Windows:
```bash
cd frontend
yarn remove sharp
yarn add --optional sharp
# OR
npm install --include=optional sharp
```

Then run:
```bash
cd frontend
node scripts/optimize-images.js
```

This will create:
- `*-thumb.jpg` (800px, 80% quality)
- `*-medium.jpg` (1200px, 85% quality)
- `*-optimized.jpg` (original size, 90% quality)

### Option 3: Vite Plugin (Future Enhancement)

Install and configure `vite-plugin-image-optimizer`:
```bash
yarn add -D vite-plugin-image-optimizer
```

Add to `vite.config.ts`:
```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
    }),
  ],
});
```

## Current Status

### Portfolio Project Images
- **VirtaMed**: `/images/projects/virtamed-thumb.jpg` (placeholder)
- **Verity**: `/images/projects/verity-thumb.jpg` (placeholder)
- **Orxonox**: `/images/projects/orxonox-thumb.jpg` (placeholder)
- **Arts & Crafts**: `/portfolio/arts-and-crafts/jupiter.jpg` ✅ (needs optimization)
- **Personal Website**: `/images/projects/portfolio-thumb.jpg` (placeholder)

### Arts & Crafts Gallery Images
All 27 images in `/frontend/public/portfolio/arts-and-crafts/` need optimization:
- Current: ~1-2MB each
- Target: ~50-100KB for thumbnails, ~200-300KB for full view

## Next Steps

1. **Create project thumbnail images:**
   - Take screenshots/photos of VirtaMed, Verity, Orxonox projects
   - Save to `/frontend/public/images/projects/`
   - Optimize using TinyPNG or Squoosh

2. **Optimize arts & crafts images:**
   - Use TinyPNG for quick batch optimization
   - Or fix Sharp installation and run the script
   - Create thumbnail versions for the gallery grid

3. **Update code to use optimized images:**
   - If using manual optimization, update image paths in `portfolioData.ts`
   - If using the script, add `-thumb` suffix to thumbnail paths

## Browser Optimization Tips

Already implemented in the code:
- ✅ Lazy loading (`loading="lazy"`)
- ✅ Background images for better performance
- ✅ Proper CSS hints for rendering

## Performance Targets

- **Thumbnail images**: < 100KB each
- **Gallery images**: < 300KB each
- **Total page load**: < 3 seconds on 3G
- **Lighthouse Performance**: > 90

## Resources

- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- Sharp docs: https://sharp.pixelplumbing.com/
- WebP format guide: https://developers.google.com/speed/webp
