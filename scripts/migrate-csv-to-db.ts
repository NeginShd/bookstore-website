import fs from 'fs';
import csv from 'csv-parser';
import { initializeDatabase, getDatabase } from '../src/lib/database';

interface CSVBook {
  title: string;
  author: string;
  year: string;
  genre: string;
  original_language: string;
  translator: string;
  summary: string;
  publisher: string;
  pages: string;
  ISBN: string;
}

// Generate random values for missing fields
function generateRandomPrice(): number {
  return Math.floor(Math.random() * 50) + 10; // Between 10-60
}

function generateRandomRating(): number {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // Between 3.0-5.0
}

function generateRandomReviewCount(): number {
  return Math.floor(Math.random() * 500) + 10; // Between 10-510
}

function generateRandomPopularity(): number {
  return Math.floor(Math.random() * 100) + 1; // Between 1-100
}

function generateRandomSalesRank(): number {
  return Math.floor(Math.random() * 1000) + 1; // Between 1-1000
}

function isNewBook(year: number): boolean {
  return year >= 2010;
}

function isHotBook(popularity: number): boolean {
  return popularity >= 80;
}

// Generate cover image URL based on title and author
function generateCoverImageUrl(title: string, author: string): string {
  // This is a placeholder - in real scenario you would use actual book cover APIs
  const encodedTitle = encodeURIComponent(title);
  const encodedAuthor = encodeURIComponent(author);
  return `https://via.placeholder.com/300x450/006633/ffffff?text=${encodedTitle}+by+${encodedAuthor}`;
}

// Determine categories based on genre and other factors
function determineCategories(book: any): string[] {
  const categories: string[] = [];
  
  if (book.is_hot) categories.push('hot-books');
  if (book.is_new) categories.push('new-releases');
  if (book.sales_rank <= 50) categories.push('bestsellers');
  if (book.genre === 'داستان کودک' || book.genre === 'فانتزی') categories.push('best-children-books');
  if (book.year <= 1970) categories.push('le-monde-100');
  if (book.year >= 1990) categories.push('century-21-top-100');
  if (book.rating >= 4.5) categories.push('man-booker');
  if (book.original_language === 'فارسی') categories.push('houshang-golshiri');
  
  return categories;
}

// Generate tags based on genre and content
function generateTags(book: any): string[] {
  const tags: string[] = [];
  
  // Add genre-based tags
  const genreMap: { [key: string]: string[] } = {
    'رمان': ['رمان', 'ادبیات'],
    'داستانی': ['داستان', 'ادبیات'],
    'رئالیسم جادویی': ['رئالیسم جادویی', 'فانتزی'],
    'تمثیلی': ['تمثیل', 'فلسفی'],
    'خاطرات': ['خاطرات', 'واقعی'],
    'سفرنامه': ['سفر', 'واقعی'],
    'شعر': ['شعر', 'ادبیات'],
    'داستان کوتاه': ['داستان کوتاه', 'ادبیات'],
    'خودآموز': ['خودآموز', 'آموزشی'],
    'فانتزی': ['فانتزی', 'خیالی'],
    'داستان کودک': ['کودک', 'خانوادگی']
  };
  
  if (genreMap[book.genre]) {
    tags.push(...genreMap[book.genre]);
  }
  
  // Add language-based tags
  if (book.original_language !== 'فارسی') {
    tags.push('ترجمه');
  } else {
    tags.push('ادبیات فارسی');
  }
  
  // Add era-based tags
  if (book.year <= 1950) {
    tags.push('کلاسیک');
  } else if (book.year >= 2000) {
    tags.push('معاصر');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

export async function migrateCSVToDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    const db = await getDatabase();
    
    console.log('Reading CSV file...');
    const books: CSVBook[] = [];
    
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream('src/data/books.csv')
        .pipe(csv())
        .on('data', (data: CSVBook) => books.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${books.length} books in CSV`);
    
    // Remove duplicates based on ISBN
    const uniqueBooks = books.filter((book, index, self) => 
      index === self.findIndex(b => b.ISBN === book.ISBN)
    );
    
    console.log(`After removing duplicates: ${uniqueBooks.length} unique books`);
    
    // Clear existing data
    await db.exec('DELETE FROM book_awards');
    await db.exec('DELETE FROM book_tags');
    await db.exec('DELETE FROM book_categories');
    await db.exec('DELETE FROM awards');
    await db.exec('DELETE FROM tags');
    await db.exec('DELETE FROM categories');
    await db.exec('DELETE FROM books');
    
    // Insert default categories
    const defaultCategories = [
      'hot-books',
      'bestsellers', 
      'new-releases',
      'best-children-books',
      'le-monde-100',
      'century-21-top-100',
      'man-booker',
      'houshang-golshiri'
    ];
    
    for (const category of defaultCategories) {
      await db.run(
        'INSERT OR IGNORE INTO categories (name) VALUES (?)',
        [category]
      );
    }
    
    console.log('Inserting books...');
    
    for (let i = 0; i < uniqueBooks.length; i++) {
      const csvBook = uniqueBooks[i];
      const year = parseInt(csvBook.year) || null;
      const pages = parseInt(csvBook.pages) || null;
      
      // Generate additional fields
      const price = generateRandomPrice();
      const rating = generateRandomRating();
      const reviewCount = generateRandomReviewCount();
      const popularity = generateRandomPopularity();
      const salesRank = generateRandomSalesRank();
      const isNew = year ? isNewBook(year) : false;
      const isHot = isHotBook(popularity);
      const coverImage = generateCoverImageUrl(csvBook.title, csvBook.author);
      
      const bookData = {
        title: csvBook.title,
        author: csvBook.author,
        year,
        genre: csvBook.genre,
        original_language: csvBook.original_language,
        translator: csvBook.translator || null,
        summary: csvBook.summary,
        publisher: csvBook.publisher,
        pages,
        isbn: csvBook.ISBN,
        price,
        cover_image: coverImage,
        available: 1,
        rating,
        review_count: reviewCount,
        popularity,
        sales_rank: salesRank,
        is_hot: isHot ? 1 : 0,
        is_new: isNew ? 1 : 0
      };
      
      // Insert book
      const result = await db.run(`
        INSERT INTO books (
          title, author, year, genre, original_language, translator, 
          summary, publisher, pages, isbn, price, cover_image, 
          available, rating, review_count, popularity, sales_rank, 
          is_hot, is_new
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bookData.title, bookData.author, bookData.year, bookData.genre,
        bookData.original_language, bookData.translator, bookData.summary,
        bookData.publisher, bookData.pages, bookData.isbn, bookData.price,
        bookData.cover_image, bookData.available, bookData.rating,
        bookData.review_count, bookData.popularity, bookData.sales_rank,
        bookData.is_hot, bookData.is_new
      ]);
      
      const bookId = result.lastID;
      
      // Add categories
      const categories = determineCategories(bookData);
      for (const categoryName of categories) {
        const categoryResult = await db.get(
          'SELECT id FROM categories WHERE name = ?',
          [categoryName]
        );
        
        if (categoryResult) {
          await db.run(
            'INSERT OR IGNORE INTO book_categories (book_id, category_id) VALUES (?, ?)',
            [bookId, categoryResult.id]
          );
        }
      }
      
      // Add tags
      const tags = generateTags(bookData);
      for (const tagName of tags) {
        // Insert tag if not exists
        await db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
        
        // Get tag id
        const tagResult = await db.get('SELECT id FROM tags WHERE name = ?', [tagName]);
        
        if (tagResult) {
          await db.run(
            'INSERT OR IGNORE INTO book_tags (book_id, tag_id) VALUES (?, ?)',
            [bookId, tagResult.id]
          );
        }
      }
      
      console.log(`Inserted book ${i + 1}/${uniqueBooks.length}: ${csvBook.title}`);
    }
    
    console.log('Migration completed successfully!');
    
    // Print statistics
    const bookCount = await db.get('SELECT COUNT(*) as count FROM books');
    const categoryCount = await db.get('SELECT COUNT(*) as count FROM categories');
    const tagCount = await db.get('SELECT COUNT(*) as count FROM tags');
    
    console.log(`\nStatistics:`);
    console.log(`- Books: ${bookCount.count}`);
    console.log(`- Categories: ${categoryCount.count}`);
    console.log(`- Tags: ${tagCount.count}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateCSVToDatabase();
} 