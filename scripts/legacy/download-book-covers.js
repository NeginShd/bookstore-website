const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const fetch = require('node-fetch');

// Function to download an image from a URL
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Make sure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Determine if we need http or https
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
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to search for book cover images on Google
async function searchBookCover(title, author, isbn) {
  try {
    const query = encodeURIComponent(`${title} ${author} book cover`);
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&cx=YOUR_CUSTOM_SEARCH_ENGINE_ID&key=YOUR_API_KEY&searchType=image&num=1`);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
    
    // If no results with title and author, try just with ISBN
    const isbnQuery = encodeURIComponent(`${isbn} book cover`);
    const isbnResponse = await fetch(`https://www.googleapis.com/customsearch/v1?q=${isbnQuery}&cx=YOUR_CUSTOM_SEARCH_ENGINE_ID&key=YOUR_API_KEY&searchType=image&num=1`);
    const isbnData = await isbnResponse.json();
    
    if (isbnData.items && isbnData.items.length > 0) {
      return isbnData.items[0].link;
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching for book cover: ${error.message}`);
    return null;
  }
}

// Alternative function using web scraping for book cover images
async function scrapeBookCover(title, author, isbn) {
  try {
    // This is a placeholder function that would implement scraping logic
    // from a site like Amazon, Goodreads, or another book resource
    console.log(`Scraping cover for: ${title} by ${author} (ISBN: ${isbn})`);
    
    // For now, we'll return a placeholder image URL for demonstration
    // In a real implementation, you would scrape a site and extract the image URL
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  } catch (error) {
    console.error(`Error scraping book cover: ${error.message}`);
    return null;
  }
}

// Main function
async function main() {
  try {
    // Start the Next.js development server if it's not already running
    console.log('Fetching book data from the API...');
    
    // Fetch book data from our API
    const response = await fetch('http://localhost:3000/api/books/check-images');
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    const books = data.books;
    
    console.log(`Found ${books.length} books. Starting to download cover images...`);
    
    // Directory to save images
    const imageDir = path.join(__dirname, '..', 'public', 'images', 'books');
    
    // Ensure the directory exists
    if (!fs.existsSync(imageDir)){
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    // Process each book
    for (const book of books) {
      const { id, title, author, isbn, coverImage } = book;
      
      // Check if we already have this image in our public directory
      const filename = `${isbn}.jpg`;
      const filepath = path.join(imageDir, filename);
      
      if (fs.existsSync(filepath)) {
        console.log(`Image already exists for "${title}" - Skipping`);
        continue;
      }
      
      console.log(`Processing: "${title}" by ${author} (ISBN: ${isbn})`);
      
      // Try to get the cover image URL - first by scraping, then by search if needed
      let imageUrl = await scrapeBookCover(title, author, isbn);
      
      if (!imageUrl) {
        console.log(`  Could not scrape cover for "${title}" - trying search API`);
        imageUrl = await searchBookCover(title, author, isbn);
      }
      
      if (imageUrl) {
        try {
          console.log(`  Downloading cover for "${title}" from ${imageUrl}`);
          await downloadImage(imageUrl, filepath);
          console.log(`  Successfully downloaded cover for "${title}"`);
        } catch (error) {
          console.error(`  Failed to download cover for "${title}": ${error.message}`);
        }
      } else {
        console.error(`  Could not find cover image for "${title}"`);
      }
    }
    
    console.log('Finished downloading book cover images');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main(); 