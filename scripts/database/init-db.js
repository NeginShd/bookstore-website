const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function initializeDatabase() {
  console.log('Initializing database...');
  
  // Database path
  const dbPath = path.join(process.cwd(), 'books.db');
  
  // Delete existing database if it exists
  if (fs.existsSync(dbPath)) {
    console.log('Removing existing database...');
    fs.unlinkSync(dbPath);
  }
  
  // Open database connection
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');
  
  console.log('Creating tables...');
  
  // Create books table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      year INTEGER,
      genre TEXT,
      original_language TEXT,
      translator TEXT,
      summary TEXT,
      publisher TEXT,
      pages INTEGER,
      isbn TEXT UNIQUE,
      price REAL DEFAULT 0,
      cover_image TEXT,
      available INTEGER DEFAULT 1,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      popularity INTEGER DEFAULT 0,
      sales_rank INTEGER,
      is_hot INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create categories table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )
  `);

  // Create book_categories junction table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS book_categories (
      book_id INTEGER,
      category_id INTEGER,
      PRIMARY KEY (book_id, category_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // Create tags table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Create book_tags junction table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS book_tags (
      book_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (book_id, tag_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);

  // Create awards table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS awards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Create book_awards junction table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS book_awards (
      book_id INTEGER,
      award_id INTEGER,
      year INTEGER,
      PRIMARY KEY (book_id, award_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (award_id) REFERENCES awards(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
    CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
    CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
    CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
    CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
    CREATE INDEX IF NOT EXISTS idx_books_popularity ON books(popularity);
    CREATE INDEX IF NOT EXISTS idx_books_sales_rank ON books(sales_rank);
  `);
  
  console.log('Inserting sample categories...');
  
  // Insert sample categories
  const categories = [
    { name: 'hot-books', description: 'Hot and trending books' },
    { name: 'bestsellers', description: 'Bestselling books' },
    { name: 'new-releases', description: 'Newly released books' },
    { name: 'le-monde-100', description: 'Le Monde 100 Best Books' },
    { name: 'century-21-top-100', description: '21st Century Top 100 Books' },
    { name: 'man-booker', description: 'Man Booker Prize Winners' },
    { name: 'houshang-golshiri', description: 'Houshang Golshiri Award Winners' },
    { name: 'best-children-books', description: 'Best Children Books' }
  ];
  
  for (const category of categories) {
    await db.run(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [category.name, category.description]
    );
  }
  
  console.log('Inserting sample tags...');
  
  // Insert sample tags
  const tags = [
    'fiction', 'non-fiction', 'classic', 'children', 'fantasy', 
    'romance', 'mystery', 'thriller', 'science-fiction', 'biography',
    'history', 'science', 'self-help', 'award-winning', 'poetry'
  ];
  
  for (const tag of tags) {
    await db.run('INSERT INTO tags (name) VALUES (?)', [tag]);
  }
  
  console.log('Inserting sample awards...');
  
  // Insert sample awards
  const awards = [
    'Man Booker Prize', 'Pulitzer Prize', 'Nobel Prize in Literature',
    'Houshang Golshiri Award', 'National Book Award', 'Hugo Award'
  ];
  
  for (const award of awards) {
    await db.run('INSERT INTO awards (name) VALUES (?)', [award]);
  }
  
  console.log('Inserting sample books...');
  
  // Sample books
  const books = [
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      year: 1988,
      genre: 'Fiction',
      original_language: 'Portuguese',
      translator: 'Alan R. Clarke',
      summary: 'A classic novel about following your dreams and listening to your heart.',
      publisher: 'HarperOne',
      pages: 197,
      isbn: '978-0062315007',
      price: 150000,
      cover_image: '/images/books/alchemist.jpg',
      available: 1,
      rating: 4.7,
      review_count: 120,
      popularity: 95,
      sales_rank: 1,
      is_hot: 1,
      is_new: 0
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      year: 1960,
      genre: 'Fiction',
      original_language: 'English',
      translator: null,
      summary: 'A novel about racial injustice and the loss of innocence in the American South.',
      publisher: 'J.B. Lippincott & Co.',
      pages: 281,
      isbn: '978-0446310789',
      price: 180000,
      cover_image: '/images/books/mockingbird.jpg',
      available: 1,
      rating: 4.9,
      review_count: 150,
      popularity: 92,
      sales_rank: 3,
      is_hot: 1,
      is_new: 0
    },
    {
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      year: 1997,
      genre: 'Fantasy',
      original_language: 'English',
      translator: null,
      summary: 'The first book in the Harry Potter series, introducing a young wizard and his adventures at Hogwarts School of Witchcraft and Wizardry.',
      publisher: 'Bloomsbury',
      pages: 223,
      isbn: '978-0747532743',
      price: 200000,
      cover_image: '/images/books/harry-potter.jpg',
      available: 1,
      rating: 4.8,
      review_count: 200,
      popularity: 98,
      sales_rank: 2,
      is_hot: 1,
      is_new: 0
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      year: 1925,
      genre: 'Fiction',
      original_language: 'English',
      translator: null,
      summary: 'A novel depicting the social and moral values of 1920s America.',
      publisher: 'Charles Scribner\'s Sons',
      pages: 180,
      isbn: '978-0743273565',
      price: 120000,
      cover_image: '/images/books/great-gatsby.jpg',
      available: 1,
      rating: 4.5,
      review_count: 90,
      popularity: 85,
      sales_rank: 10,
      is_hot: 0,
      is_new: 0
    },
    {
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      year: 1943,
      genre: 'Children',
      original_language: 'French',
      translator: 'Katherine Woods',
      summary: 'A poetic tale about a young prince who visits various planets in space, including Earth.',
      publisher: 'Reynal & Hitchcock',
      pages: 96,
      isbn: '978-0156012195',
      price: 90000,
      cover_image: '/images/books/little-prince.jpg',
      available: 1,
      rating: 4.9,
      review_count: 180,
      popularity: 90,
      sales_rank: 5,
      is_hot: 1,
      is_new: 0
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      year: 2018,
      genre: 'Self-Help',
      original_language: 'English',
      translator: null,
      summary: 'A guide to building good habits and breaking bad ones.',
      publisher: 'Avery',
      pages: 320,
      isbn: '978-0735211292',
      price: 220000,
      cover_image: '/images/books/atomic-habits.jpg',
      available: 1,
      rating: 4.8,
      review_count: 110,
      popularity: 96,
      sales_rank: 4,
      is_hot: 1,
      is_new: 1
    },
    {
      title: 'The Kite Runner',
      author: 'Khaled Hosseini',
      year: 2003,
      genre: 'Fiction',
      original_language: 'English',
      translator: null,
      summary: 'A novel about friendship, betrayal, and redemption set against the backdrop of Afghanistan\'s history.',
      publisher: 'Riverhead Books',
      pages: 371,
      isbn: '978-1594631931',
      price: 170000,
      cover_image: '/images/books/kite-runner.jpg',
      available: 1,
      rating: 4.7,
      review_count: 130,
      popularity: 88,
      sales_rank: 8,
      is_hot: 0,
      is_new: 0
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      year: 1813,
      genre: 'Fiction',
      original_language: 'English',
      translator: null,
      summary: 'A romantic novel about the importance of marrying for love rather than social advancement.',
      publisher: 'T. Egerton',
      pages: 432,
      isbn: '978-0141439518',
      price: 130000,
      cover_image: '/images/books/pride-prejudice.jpg',
      available: 1,
      rating: 4.6,
      review_count: 100,
      popularity: 80,
      sales_rank: 15,
      is_hot: 0,
      is_new: 0
    },
    {
      title: 'The Hunger Games',
      author: 'Suzanne Collins',
      year: 2008,
      genre: 'Science Fiction',
      original_language: 'English',
      translator: null,
      summary: 'A dystopian novel where teenagers must fight to the death in a televised battle.',
      publisher: 'Scholastic Press',
      pages: 374,
      isbn: '978-0439023481',
      price: 160000,
      cover_image: '/images/books/hunger-games.jpg',
      available: 1,
      rating: 4.5,
      review_count: 140,
      popularity: 87,
      sales_rank: 9,
      is_hot: 0,
      is_new: 0
    },
    {
      title: 'Rich Dad Poor Dad',
      author: 'Robert T. Kiyosaki',
      year: 1997,
      genre: 'Personal Finance',
      original_language: 'English',
      translator: null,
      summary: 'A book advocating financial independence through investing, real estate, and starting businesses.',
      publisher: 'Warner Books',
      pages: 207,
      isbn: '978-1612680194',
      price: 190000,
      cover_image: '/images/books/rich-dad.jpg',
      available: 1,
      rating: 4.6,
      review_count: 95,
      popularity: 89,
      sales_rank: 7,
      is_hot: 1,
      is_new: 0
    }
  ];
  
  // Insert books
  for (const book of books) {
    const result = await db.run(`
      INSERT INTO books (
        title, author, year, genre, original_language, translator, summary, 
        publisher, pages, isbn, price, cover_image, available, rating, 
        review_count, popularity, sales_rank, is_hot, is_new
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      book.title, book.author, book.year, book.genre, book.original_language,
      book.translator, book.summary, book.publisher, book.pages, book.isbn,
      book.price, book.cover_image, book.available, book.rating,
      book.review_count, book.popularity, book.sales_rank, book.is_hot, book.is_new
    ]);
    
    const bookId = result.lastID;
    
    // Assign categories
    const bookCategories = [];
    
    if (book.is_hot === 1) bookCategories.push('hot-books');
    if (book.sales_rank && book.sales_rank <= 5) bookCategories.push('bestsellers');
    if (book.is_new === 1) bookCategories.push('new-releases');
    if (book.genre === 'Children') bookCategories.push('best-children-books');
    
    // Add more category assignments based on book properties
    if (book.year < 2000 && book.rating > 4.5) bookCategories.push('le-monde-100');
    if (book.year >= 2000 && book.rating > 4.5) bookCategories.push('century-21-top-100');
    
    // Randomly assign Man Booker or Houshang Golshiri to some books
    if (Math.random() > 0.7) {
      bookCategories.push(Math.random() > 0.5 ? 'man-booker' : 'houshang-golshiri');
    }
    
    // Insert book-category relationships
    for (const categoryName of bookCategories) {
      const category = await db.get('SELECT id FROM categories WHERE name = ?', [categoryName]);
      if (category) {
        await db.run(
          'INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)',
          [bookId, category.id]
        );
      }
    }
    
    // Assign tags
    const bookTags = [];
    
    // Add fiction/non-fiction tag
    if (['Fiction', 'Fantasy', 'Science Fiction'].includes(book.genre)) {
      bookTags.push('fiction');
    } else {
      bookTags.push('non-fiction');
    }
    
    // Add genre-specific tags
    if (book.genre === 'Children') bookTags.push('children');
    if (book.genre === 'Fantasy') bookTags.push('fantasy');
    if (book.genre === 'Science Fiction') bookTags.push('science-fiction');
    if (book.genre === 'Self-Help') bookTags.push('self-help');
    
    // Add more tags based on other properties
    if (book.year < 1950) bookTags.push('classic');
    if (book.rating > 4.7) bookTags.push('award-winning');
    
    // Insert book-tag relationships
    for (const tagName of bookTags) {
      const tag = await db.get('SELECT id FROM tags WHERE name = ?', [tagName]);
      if (tag) {
        await db.run(
          'INSERT INTO book_tags (book_id, tag_id) VALUES (?, ?)',
          [bookId, tag.id]
        );
      }
    }
    
    // Assign awards to some books
    if (bookCategories.includes('man-booker')) {
      const award = await db.get('SELECT id FROM awards WHERE name = ?', ['Man Booker Prize']);
      if (award) {
        await db.run(
          'INSERT INTO book_awards (book_id, award_id, year) VALUES (?, ?, ?)',
          [bookId, award.id, book.year + 1]
        );
      }
    }
    
    if (bookCategories.includes('houshang-golshiri')) {
      const award = await db.get('SELECT id FROM awards WHERE name = ?', ['Houshang Golshiri Award']);
      if (award) {
        await db.run(
          'INSERT INTO book_awards (book_id, award_id, year) VALUES (?, ?, ?)',
          [bookId, award.id, book.year + 2]
        );
      }
    }
  }
  
  console.log('Database initialization complete!');
  await db.close();
}

initializeDatabase().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
}); 