#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');

// Configuration
const config = {
  // Thumbnail sizes for portfolio cards
  thumbnail: {
    width: 800,
    quality: 80,
    suffix: '-thumb',
  },
  // Medium size for gallery views
  medium: {
    width: 1200,
    quality: 85,
    suffix: '-medium',
  },
  // Keep originals but optimize them
  original: {
    quality: 90,
  },
};

// Directories to process
const imageDirs = ['portfolio/arts-and-crafts'];

async function getAllImages(dir) {
  const images = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      images.push(...(await getAllImages(fullPath)));
    } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
      // Skip already optimized files
      if (!entry.name.includes('-thumb') && !entry.name.includes('-medium')) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

async function optimizeImage(imagePath) {
  const ext = extname(imagePath);
  const base = basename(imagePath, ext);
  const dir = dirname(imagePath);

  console.log(`Processing: ${basename(imagePath)}`);

  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    console.log(`  Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);

    // Create thumbnail
    const thumbPath = join(dir, `${base}${config.thumbnail.suffix}${ext}`);
    await image
      .clone()
      .resize(config.thumbnail.width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({ quality: config.thumbnail.quality })
      .toFile(thumbPath);

    const thumbStats = await stat(thumbPath);
    console.log(`  ✓ Thumbnail: ${config.thumbnail.width}px, ${(thumbStats.size / 1024).toFixed(1)}KB`);

    // Create medium size
    const mediumPath = join(dir, `${base}${config.medium.suffix}${ext}`);
    await image
      .clone()
      .resize(config.medium.width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({ quality: config.medium.quality })
      .toFile(mediumPath);

    const mediumStats = await stat(mediumPath);
    console.log(`  ✓ Medium: ${config.medium.width}px, ${(mediumStats.size / 1024).toFixed(1)}KB`);

    // Optimize original (create backup with -original suffix first if desired)
    const optimizedPath = join(dir, `${base}-optimized${ext}`);
    await image
      .clone()
      .jpeg({ quality: config.original.quality })
      .toFile(optimizedPath);

    const optimizedStats = await stat(optimizedPath);
    const originalStats = await stat(imagePath);
    const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

    console.log(
      `  ✓ Optimized: ${(optimizedStats.size / 1024).toFixed(1)}KB (saved ${savings}%)`
    );
    console.log('');
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    console.log('');
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');

  for (const dir of imageDirs) {
    const fullDir = join(publicDir, dir);
    console.log(`Scanning: ${dir}\n`);

    try {
      const images = await getAllImages(fullDir);
      console.log(`Found ${images.length} images to optimize\n`);

      for (const imagePath of images) {
        await optimizeImage(imagePath);
      }
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error.message);
    }
  }

  console.log('✅ Done!\n');
  console.log('Next steps:');
  console.log('1. Update your code to use *-thumb.jpg for thumbnails');
  console.log('2. Use *-medium.jpg for gallery views');
  console.log('3. Use *-optimized.jpg as the optimized originals');
}

main();
