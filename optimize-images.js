/**
 * Image Optimization Script for NOVA Vision Eye Clinic
 * 
 * This script optimizes images for web use.
 * Prerequisites: npm install sharp
 * 
 * Usage: node optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'images', 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image optimization configurations
const optimizationConfigs = {
  'logo.png': [
    { width: 200, format: 'png', name: 'logo.png' }
  ],
  'doctor-patient-ophthalmologist-s-office.jpg': [
    { width: 1920, quality: 80, name: 'hero-full.jpg' },
    { width: 1200, quality: 75, name: 'hero-lg.jpg' },
    { width: 768, quality: 70, name: 'hero-md.jpg' }
  ],
  'patient-ophthalmologist-s-office.jpg': [
    { width: 1200, quality: 80, name: 'service-full.jpg' },
    { width: 768, quality: 75, name: 'service-lg.jpg' },
    { width: 480, quality: 70, name: 'service-md.jpg' }
  ],
  'harpreet-singh-ioYYWWX2fjk-unsplash.jpg': [
    { width: 1200, quality: 80, name: 'occupational-full.jpg' },
    { width: 768, quality: 75, name: 'occupational-lg.jpg' },
    { width: 480, quality: 70, name: 'occupational-md.jpg' }
  ],
  'young-african-woman-holds-glasses-with-diopter-lenses-looks-through-them-problem-myopia-vision-correction.jpg': [
    { width: 1200, quality: 80, name: 'vision-full.jpg' },
    { width: 768, quality: 75, name: 'vision-lg.jpg' },
    { width: 480, quality: 70, name: 'vision-md.jpg' }
  ],
  'close-up-man-repairing-computer-chips.jpg': [
    { width: 1200, quality: 80, name: 'safety-full.jpg' },
    { width: 768, quality: 75, name: 'safety-lg.jpg' },
    { width: 480, quality: 70, name: 'safety-md.jpg' }
  ],
  'ophthalmologist-doctor-consulting-patient.jpg': [
    { width: 1200, quality: 80, name: 'disease-full.jpg' },
    { width: 768, quality: 75, name: 'disease-lg.jpg' },
    { width: 480, quality: 70, name: 'disease-md.jpg' }
  ]
};

async function optimizeImages() {
  console.log('🔄 Starting image optimization...\n');

  for (const [inputFile, configs] of Object.entries(optimizationConfigs)) {
    const inputPath = path.join(imagesDir, inputFile);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${inputFile} (file not found)`);
      continue;
    }

    for (const config of configs) {
      try {
        const outputPath = path.join(outputDir, config.name);
        
        await sharp(inputPath)
          .resize(config.width, null, { withoutEnlargement: true })
          .toFormat('jpeg', { quality: config.quality || 80, progressive: true })
          .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ ${config.name} (${config.width}px, ${sizeKB} KB)`);
      } catch (error) {
        console.log(`❌ Error processing ${config.name}: ${error.message}`);
      }
    }
  }

  console.log('\n✨ Image optimization complete!');
  console.log('📁 Optimized images saved to: images/optimized/');
}

optimizeImages().catch(console.error);
