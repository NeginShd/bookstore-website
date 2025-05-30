import path from 'path';

// Import SQLite modules only on server side
let sqlite3: any;
let open: any;
let Database: any;

if (typeof window === 'undefined') {
  // Server-side only
  sqlite3 = require('sqlite3');
  const sqliteLib = require('sqlite');
  open = sqliteLib.open;
  Database = sqliteLib.Database;
}

let db: any = null;

export async function getDatabase() {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be performed on the server side');
  }

  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'books.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');
  
  return db;
}

export async function initializeDatabase() {
  if (typeof window !== 'undefined') {
    throw new Error('Database initialization can only be performed on the server side');
  }

  const database = await getDatabase();
  
  // Create books table
  await database.exec(`
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
      available BOOLEAN DEFAULT 1,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      popularity INTEGER DEFAULT 0,
      sales_rank INTEGER,
      is_hot BOOLEAN DEFAULT 0,
      is_new BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create categories table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    )
  `);

  // Create book_categories junction table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS book_categories (
      book_id INTEGER,
      category_id INTEGER,
      PRIMARY KEY (book_id, category_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // Create tags table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Create book_tags junction table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS book_tags (
      book_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (book_id, tag_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);

  // Create awards table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS awards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Create book_awards junction table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS book_awards (
      book_id INTEGER,
      award_id INTEGER,
      year INTEGER,
      PRIMARY KEY (book_id, award_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (award_id) REFERENCES awards(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
    CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
    CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
    CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
    CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
    CREATE INDEX IF NOT EXISTS idx_books_popularity ON books(popularity);
    CREATE INDEX IF NOT EXISTS idx_books_sales_rank ON books(sales_rank);
  `);

  console.log('Database initialized successfully');
  return database;
}

export async function closeDatabase() {
  if (typeof window !== 'undefined') {
    return;
  }
  
  if (db) {
    await db.close();
    db = null;
  }
} 