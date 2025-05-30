const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    console.log('Converting logo to favicon...');
    
    // Create buffer from logo.jpg
    const logoPath = path.join(__dirname, '../public/logo.jpg');
    
    // Process the image and save as ico
    await sharp(logoPath)
      .resize(32, 32) // Standard favicon size
      .toFile(path.join(__dirname, '../public/favicon.ico'));
      
    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 