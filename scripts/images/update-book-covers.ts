import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// This interface matches the structure of books in our database
interface DatabaseBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  cover_image: string;
}

// Get database connection
async function getDatabase() {
  return open({
    filename: path.join(process.cwd(), 'books.db'),
    driver: sqlite3.Database
  });
}

// Google Books API search and image extraction
async function searchBookCover(title: string, author: string, isbn: string): Promise<string | null> {
  try {
    // Try searching by ISBN first (most accurate)
    let searchQuery = `isbn:${isbn}`;
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&langRestrict=fa`);
    let data = await response.json() as any;
    
    // If no results with ISBN, try title and author
    if (!data.items || data.items.length === 0) {
      searchQuery = `intitle:${title} inauthor:${author}`;
      response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&langRestrict=fa`);
      data = await response.json() as any;
    }
    
    // If we have results, extract the image link
    if (data.items && data.items.length > 0) {
      // Get the first result with an image
      for (const item of data.items) {
        if (item.volumeInfo && 
            item.volumeInfo.imageLinks && 
            (item.volumeInfo.imageLinks.thumbnail || item.volumeInfo.imageLinks.smallThumbnail)) {
          // Get the largest image available
          const imageUrl = item.volumeInfo.imageLinks.thumbnail || 
                          item.volumeInfo.imageLinks.smallThumbnail;
          
          // Replace http with https and remove zoom parameters for better quality
          return imageUrl.replace('http://', 'https://').replace('&zoom=1', '');
        }
      }
    }
    
    // If Google Books fails, we'll try Open Library API
    if (isbn) {
      const openLibraryResponse = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const openLibraryData = await openLibraryResponse.json() as any;
      
      if (openLibraryData[`ISBN:${isbn}`] && openLibraryData[`ISBN:${isbn}`].cover) {
        return openLibraryData[`ISBN:${isbn}`].cover.medium || 
              openLibraryData[`ISBN:${isbn}`].cover.small;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching for book cover: ${error}`);
    return null;
  }
}

// Save image to our public folder
async function saveImageLocally(imageUrl: string, isbn: string): Promise<string> {
  try {
    // Create directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'books');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    // Determine file extension based on content type
    const contentType = response.headers.get('content-type') || '';
    let extension = '.jpg';
    if (contentType.includes('png')) {
      extension = '.png';
    } else if (contentType.includes('gif')) {
      extension = '.gif';
    } else if (contentType.includes('webp')) {
      extension = '.webp';
    }
    
    // Create a filename using the book ISBN
    const filename = `${isbn}${extension}`;
    const filePath = path.join(imagesDir, filename);
    
    // Save the image
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
    
    // Return the relative path for database storage
    return `/images/books/${filename}`;
  } catch (error) {
    console.error(`Error saving image: ${error}`);
    return '/default/default-book-cover.png';
  }
}

// Update the book cover in the database
async function updateBookCover(bookId: number, coverPath: string): Promise<void> {
  try {
    const db = await getDatabase();
    await db.run(
      'UPDATE books SET cover_image = ? WHERE id = ?',
      [coverPath, bookId]
    );
    console.log(`✅ Updated book ID ${bookId} with cover: ${coverPath}`);
  } catch (error) {
    console.error(`Error updating book record: ${error}`);
  }
}

// Main function to update all book covers
export async function updateBookCovers() {
  try {
    console.log('🔄 Starting book cover update process...');
    const db = await getDatabase();
    
    // Get all books from the database
    const books: DatabaseBook[] = await db.all(`
      SELECT id, title, author, isbn, cover_image
      FROM books
      ORDER BY id
    `);
    
    console.log(`📚 Found ${books.length} books to process`);
    
    // Process each book
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      console.log(`\n📖 Processing book ${i + 1}/${books.length}: "${book.title}" by ${book.author}`);
      
      // Check if the current cover is a placeholder or default
      const isDefaultCover = book.cover_image.includes('placeholder.com') || 
                            book.cover_image.includes('default-book-cover.png') ||
                            !book.cover_image;
      if (!isDefaultCover) {
        console.log(`⏩ Book already has a non-default cover image. Skipping.`);
        continue;
      }
      
      // Search for a cover image
      console.log(`🔍 Searching for cover image...`);
      const imageUrl = await searchBookCover(book.title, book.author, book.isbn);
      
      if (imageUrl) {
        console.log(`🖼️ Found image: ${imageUrl}`);
        
        // Save the image locally (now using ISBN instead of book ID)
        const localPath = await saveImageLocally(imageUrl, book.isbn);
        
        if (localPath) {
          // Update the database
          await updateBookCover(book.id, localPath);
        } else {
          console.log(`❌ Failed to save image locally`);
        }
      } else {
        console.log(`❌ No cover image found for "${book.title}"`);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ Book cover update process completed!');
  } catch (error) {
    console.error(`Error in updateBookCovers: ${error}`);
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  updateBookCovers()
    .then(() => console.log('Finished updating book covers'))
    .catch(err => console.error('Error:', err));
} 