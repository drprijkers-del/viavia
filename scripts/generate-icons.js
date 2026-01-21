// Simple icon generator using canvas
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1C1C1E"/>
  <text x="50%" y="55%" font-family="-apple-system, BlinkMacSystemFont, sans-serif"
        font-size="${size * 0.6}" font-weight="bold" fill="#FFFFFF"
        text-anchor="middle" dominant-baseline="middle">V</text>
</svg>`;
}

// Ensure directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Write SVG files (browsers will render these)
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), createSVGIcon(512));

console.log('✓ Icons generated at public/icons/');
console.log('Note: SVG icons work for PWA. For PNG, use an online converter or install sharp package.');
