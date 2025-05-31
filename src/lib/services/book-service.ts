import { getDatabase } from '../database';
import type { Book } from '@/lib/types';
import type { BookCategory } from '@/components/books/BookRowsSection';

export interface DatabaseBook {
  id: number;
  title: string;
  author: string;
  year: number | null;
  genre: string;
  original_language: string;
  translator: string | null;
  summary: string;
  publisher: string;
  pages: number | null;
  isbn: string;
  price: number;
  cover_image: string;
  available: number;
  rating: number;
  review_count: number;
  popularity: number;
  sales_rank: number | null;
  is_hot: number;
  is_new: number;
  created_at: string;
  updated_at: string;
  categories?: string;
  tags?: string;
  awards?: string;
}

export interface BookWithCategories {
  id: number;
  title: string;
  author: string;
  year: number | null;
  genre: string;
  original_language: string;
  translator: string | null;
  summary: string;
  publisher: string;
  pages: number | null;
  isbn: string;
  price: number;
  cover_image: string;
  available: number;
  rating: number;
  review_count: number;
  popularity: number;
  sales_rank: number | null;
  is_hot: number;
  is_new: number;
  created_at: string;
  updated_at: string;
  categories: string[];
  tags: string[];
  awards: string[];
}

function convertDatabaseBookToBook(dbBook: BookWithCategories): Book {
  // Create a properly formatted Book object from database record
  return {
    id: dbBook.id.toString(),
    title: dbBook.title,
    author: dbBook.author,
    isbn: dbBook.isbn || '',
    coverImage: dbBook.cover_image || '',
    price: dbBook.price || 0,
    description: dbBook.summary || '',
    genre: dbBook.genre || '',
    available: Boolean(dbBook.available),
    rating: dbBook.rating || 0,
    reviewCount: dbBook.review_count || 0,
    categories: dbBook.categories
      .filter(Boolean)
      .filter(cat => 
        ['hot-books', 'bestsellers', 'new-releases', 'le-monde-100', 
        'century-21-top-100', 'man-booker', 'houshang-golshiri', 
        'best-children-books'].includes(cat)) as BookCategory[],
    publishedYear: dbBook.year || undefined,
    popularity: dbBook.popularity || 0,
    salesRank: dbBook.sales_rank || undefined,
    isHot: Boolean(dbBook.is_hot),
    isNew: Boolean(dbBook.is_new),
    tags: dbBook.tags || [],
    awards: dbBook.awards || [],
    dataAiHint: dbBook.summary ? dbBook.summary.substring(0, 50) + '...' : ''
  };
}

export class BookService {
  private static instance: BookService;

  static getInstance(): BookService {
    if (!BookService.instance) {
      BookService.instance = new BookService();
    }
    return BookService.instance;
  }

  async getAllBooks(): Promise<Book[]> {
    const db = await getDatabase();
    
    // Get books with their categories, tags, and awards
    const books = await db.all(`
      SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT a.name) as awards
      FROM books b
      LEFT JOIN book_categories bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      LEFT JOIN book_tags bt ON b.id = bt.book_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      LEFT JOIN book_awards ba ON b.id = ba.book_id
      LEFT JOIN awards a ON ba.award_id = a.id
      GROUP BY b.id
      ORDER BY b.title
    `);

    return books.map((book: DatabaseBook) => {
      const bookWithCategories: BookWithCategories = {
        ...book,
        categories: book.categories ? book.categories.split(',') : [],
        tags: book.tags ? book.tags.split(',') : [],
        awards: book.awards ? book.awards.split(',') : []
      };
      return convertDatabaseBookToBook(bookWithCategories);
    });
  }

  async getBookById(id: string): Promise<Book | null> {
    const db = await getDatabase();
    
    console.log(`Getting book by ID: ${id}`);
    
    const book = await db.get(`
      SELECT 
        b.*,
        (
          SELECT GROUP_CONCAT(cat.name)
          FROM book_categories bc
          JOIN categories cat ON bc.category_id = cat.id
          WHERE bc.book_id = b.id
        ) as categories,
        (
          SELECT GROUP_CONCAT(t.name)
          FROM book_tags bt
          JOIN tags t ON bt.tag_id = t.id
          WHERE bt.book_id = b.id
        ) as tags,
        (
          SELECT GROUP_CONCAT(a.name)
          FROM book_awards ba
          JOIN awards a ON ba.award_id = a.id
          WHERE ba.book_id = b.id
        ) as awards
      FROM books b
      WHERE b.id = ?
    `, [parseInt(id, 10)]);

    if (!book) {
      console.log(`No book found with ID: ${id}`);
      return null;
    }

    console.log(`Found book: ${book.title}`);
    
    const bookWithCategories: BookWithCategories = {
      ...book,
      categories: book.categories ? book.categories.split(',') : [],
      tags: book.tags ? book.tags.split(',') : [],
      awards: book.awards ? book.awards.split(',') : []
    };

    return convertDatabaseBookToBook(bookWithCategories);
  }

  async searchBooks(
    query?: string,
    genre?: string,
    category?: string,
    page: number = 1,
    limit: number = 12,
    sortBy: string = 'title',
    order: string = 'asc'
  ): Promise<{
    books: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const db = await getDatabase();
    
    console.log(`searchBooks: query=${query}, genre=${genre}, category=${category}, page=${page}, limit=${limit}`);
    
    const whereConditions: string[] = [];
    const params: (string | number)[] = [];
    
    // Build WHERE conditions
    if (query) {
      whereConditions.push(`(
        b.title LIKE ? OR 
        b.author LIKE ? OR 
        b.isbn LIKE ? OR 
        b.summary LIKE ?
      )`);
      const searchPattern = `%${query}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    if (genre) {
      whereConditions.push('b.genre = ?');
      params.push(genre);
    }
    
    // Always use a JOIN for categories so we can properly filter
    let joinClause = '';
    if (category) {
      // Rather than adding to WHERE, we'll join with the categories table
      joinClause = `
        JOIN book_categories bc ON b.id = bc.book_id
        JOIN categories c ON bc.category_id = c.id AND c.name = ?
      `;
      params.push(category);
    } else {
      // If we're not filtering by category, use LEFT JOIN so we still get all books
      joinClause = `
        LEFT JOIN book_categories bc ON b.id = bc.book_id
        LEFT JOIN categories c ON bc.category_id = c.id
      `;
    }
    
    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT b.id) as total
      FROM books b
      ${joinClause}
      ${whereClause}
    `;
    
    console.log(`Count query: ${countQuery}`);
    console.log(`Params: ${params.join(', ')}`);
    
    const countResult = await db.get(countQuery, params);
    const total = countResult ? countResult.total : 0;
    
    console.log(`Total count: ${total}`);
    
    // Get books with pagination
    const offset = (page - 1) * limit;
    
    let orderByClause = 'ORDER BY ';
    switch (sortBy) {
      case 'price':
        orderByClause += `b.price ${order}`;
        break;
      case 'rating':
        orderByClause += `b.rating ${order}`;
        break;
      case 'popularity':
        orderByClause += `b.popularity ${order}`;
        break;
      case 'publishedYear':
        orderByClause += `b.year ${order}`;
        break;
      case 'salesRank':
        orderByClause += `b.sales_rank ${order}`;
        break;
      case 'author':
        orderByClause += `b.author ${order}`;
        break;
      default:
        orderByClause += `b.title ${order}`;
    }
    
    // Use a subquery to get all the categories for each book
    const booksQuery = `
      SELECT 
        b.*,
        (
          SELECT GROUP_CONCAT(cat.name)
          FROM book_categories bc2
          JOIN categories cat ON bc2.category_id = cat.id
          WHERE bc2.book_id = b.id
        ) as categories,
        (
          SELECT GROUP_CONCAT(t.name)
          FROM book_tags bt
          JOIN tags t ON bt.tag_id = t.id
          WHERE bt.book_id = b.id
        ) as tags,
        (
          SELECT GROUP_CONCAT(a.name)
          FROM book_awards ba
          JOIN awards a ON ba.award_id = a.id
          WHERE ba.book_id = b.id
        ) as awards
      FROM books b
      ${joinClause}
      ${whereClause}
      GROUP BY b.id
      ${orderByClause}
      LIMIT ? OFFSET ?
    `;
    
    console.log(`Books query: ${booksQuery}`);
    
    const booksResult = await db.all(booksQuery, [...params, limit, offset]);
    
    console.log(`Found ${booksResult.length} books`);
    
    const books = booksResult.map((book: DatabaseBook) => {
      const bookWithCategories: BookWithCategories = {
        ...book,
        categories: book.categories ? book.categories.split(',') : [],
        tags: book.tags ? book.tags.split(',') : [],
        awards: book.awards ? book.awards.split(',') : []
      };
      return convertDatabaseBookToBook(bookWithCategories);
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      books,
      total,
      page,
      limit,
      totalPages
    };
  }

  async getBooksByCategory(categoryName: string, limit: number = 10): Promise<Book[]> {
    const db = await getDatabase();
    
    console.log(`Getting books by category: ${categoryName}, limit: ${limit}`);
    
    const books = await db.all(`
      SELECT 
        b.*,
        (
          SELECT GROUP_CONCAT(cat.name)
          FROM book_categories bc2
          JOIN categories cat ON bc2.category_id = cat.id
          WHERE bc2.book_id = b.id
        ) as categories,
        (
          SELECT GROUP_CONCAT(t.name)
          FROM book_tags bt
          JOIN tags t ON bt.tag_id = t.id
          WHERE bt.book_id = b.id
        ) as tags,
        (
          SELECT GROUP_CONCAT(a.name)
          FROM book_awards ba
          JOIN awards a ON ba.award_id = a.id
          WHERE ba.book_id = b.id
        ) as awards
      FROM books b
      JOIN book_categories bc ON b.id = bc.book_id
      JOIN categories c ON bc.category_id = c.id AND c.name = ?
      GROUP BY b.id
      LIMIT ?
    `, [categoryName, limit]);

    console.log(`Found ${books.length} books in category ${categoryName}`);
    
    return books.map((book: DatabaseBook) => {
      const bookWithCategories: BookWithCategories = {
        ...book,
        categories: book.categories ? book.categories.split(',') : [],
        tags: book.tags ? book.tags.split(',') : [],
        awards: book.awards ? book.awards.split(',') : []
      };
      return convertDatabaseBookToBook(bookWithCategories);
    });
  }

  async getCategories(): Promise<{ name: string; description?: string }[]> {
    const db = await getDatabase();
    return db.all('SELECT name, description FROM categories');
  }

  async getTags(): Promise<{ name: string }[]> {
    const db = await getDatabase();
    return db.all('SELECT name FROM tags');
  }

  async getGenres(): Promise<{ genre: string; count: number }[]> {
    const db = await getDatabase();
    return db.all(`
      SELECT genre, COUNT(*) as count 
      FROM books 
      GROUP BY genre 
      ORDER BY count DESC
    `);
  }
} 