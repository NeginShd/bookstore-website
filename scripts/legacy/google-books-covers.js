const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Directory where book covers are/will be stored
const bookImagesDir = path.join(__dirname, '../public/images/books');

// Function to download an image from a URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      console.error(`❌ Error downloading ${path.basename(filepath)}: ${err.message}`);
      reject(err);
    });
  });
}

// Function to get book info from Google Books API
async function getBookInfo(isbn) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function
async function main() {
  try {
    // Ensure the images directory exists
    if (!fs.existsSync(bookImagesDir)) {
      fs.mkdirSync(bookImagesDir, { recursive: true });
    }
    
    // Get all files in the book images directory
    const files = fs.readdirSync(bookImagesDir);
    
    // Process each file (which should be named with an ISBN)
    for (const file of files) {
      // Extract the ISBN from the filename
      const isbn = path.basename(file, path.extname(file)).trim();
      
      // Skip if not a valid ISBN format
      if (!isbn.match(/^[0-9]{10,13}$/)) {
        console.log(`⚠️ Skipping invalid ISBN format: ${isbn}`);
        continue;
      }
      
      const filepath = path.join(bookImagesDir, file);
      
      // Check file size - if less than 10KB, consider it an empty or placeholder file
      const stats = fs.statSync(filepath);
      if (stats.size > 10 * 1024) {
        console.log(`ℹ️ Skipping existing valid image: ${file}`);
        continue;
      }
      
      console.log(`🔍 Processing ISBN: ${isbn}`);
      
      try {
        // Get book info from Google Books API
        const bookInfo = await getBookInfo(isbn);
        
        if (bookInfo.totalItems > 0 && 
            bookInfo.items && 
            bookInfo.items[0].volumeInfo && 
            bookInfo.items[0].volumeInfo.imageLinks) {
          
          const imageLinks = bookInfo.items[0].volumeInfo.imageLinks;
          
          // Try to get the largest image available
          const imageUrl = 
            imageLinks.extraLarge || 
            imageLinks.large || 
            imageLinks.medium || 
            imageLinks.small || 
            imageLinks.thumbnail;
          
          if (imageUrl) {
            // Google Books API returns URLs with http, we need to change to https
            const secureImageUrl = imageUrl.replace('http://', 'https://');
            await downloadImage(secureImageUrl, filepath);
          } else {
            console.error(`❌ No image links found for ISBN: ${isbn}`);
          }
        } else {
          console.error(`❌ No book information found for ISBN: ${isbn}`);
        }
      } catch (error) {
        console.error(`❌ Error getting book info for ISBN ${isbn}: ${error.message}`);
      }
      
      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Finished downloading book cover images');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main(); 