-- Initial database schema

-- Books table
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
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Book-categories junction table
CREATE TABLE IF NOT EXISTS book_categories (
  book_id INTEGER,
  category_id INTEGER,
  PRIMARY KEY (book_id, category_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Book-tags junction table
CREATE TABLE IF NOT EXISTS book_tags (
  book_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (book_id, tag_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Awards table
CREATE TABLE IF NOT EXISTS awards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Book-awards junction table
CREATE TABLE IF NOT EXISTS book_awards (
  book_id INTEGER,
  award_id INTEGER,
  year INTEGER,
  PRIMARY KEY (book_id, award_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (award_id) REFERENCES awards(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_popularity ON books(popularity);
CREATE INDEX IF NOT EXISTS idx_books_sales_rank ON books(sales_rank); 