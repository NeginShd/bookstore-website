import { getDatabase } from './database';
import type { Book } from './types';

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
}

export interface BookWithCategories extends DatabaseBook {
  categories: string[];
  tags: string[];
  awards: string[];
}

function convertDatabaseBookToBook(dbBook: BookWithCategories): Book {
  return {
    id: dbBook.id.toString(),
    title: dbBook.title,
    author: dbBook.author,
    isbn: dbBook.isbn,
    coverImage: dbBook.cover_image,
    price: dbBook.price,
    description: dbBook.summary,
    genre: dbBook.genre,
    available: dbBook.available === 1,
    rating: dbBook.rating,
    reviewCount: dbBook.review_count,
    categories: dbBook.categories as any[],
    publishedYear: dbBook.year || undefined,
    popularity: dbBook.popularity,
    salesRank: dbBook.sales_rank || undefined,
    isHot: dbBook.is_hot === 1,
    isNew: dbBook.is_new === 1,
    tags: dbBook.tags,
    awards: dbBook.awards,
    dataAiHint: dbBook.summary.substring(0, 50) + '...'
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

    return books.map((book: any) => {
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
    
    const book = await db.get(`
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
      WHERE b.id = ?
      GROUP BY b.id
    `, [parseInt(id)]);

    if (!book) return null;

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
    
    let whereConditions: string[] = [];
    let params: any[] = [];
    
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
    
    if (category) {
      whereConditions.push('c.name = ?');
      params.push(category);
    }
    
    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT b.id) as total
      FROM books b
      LEFT JOIN book_categories bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      ${whereClause}
    `;
    
    const { total } = await db.get(countQuery, params);
    
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
    
    const booksQuery = `
      SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT cat.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT a.name) as awards
      FROM books b
      LEFT JOIN book_categories bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      LEFT JOIN categories cat ON bc.category_id = cat.id
      LEFT JOIN book_tags bt ON b.id = bt.book_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      LEFT JOIN book_awards ba ON b.id = ba.book_id
      LEFT JOIN awards a ON ba.award_id = a.id
      ${whereClause}
      GROUP BY b.id
      ${orderByClause}
      LIMIT ? OFFSET ?
    `;
    
    const books = await db.all(booksQuery, [...params, limit, offset]);
    
    const convertedBooks = books.map((book: any) => {
      const bookWithCategories: BookWithCategories = {
        ...book,
        categories: book.categories ? book.categories.split(',') : [],
        tags: book.tags ? book.tags.split(',') : [],
        awards: book.awards ? book.awards.split(',') : []
      };
      return convertDatabaseBookToBook(bookWithCategories);
    });
    
    return {
      books: convertedBooks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getBooksByCategory(categoryName: string, limit: number = 10): Promise<Book[]> {
    const db = await getDatabase();
    
    const books = await db.all(`
      SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT cat.name) as categories,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT a.name) as awards
      FROM books b
      JOIN book_categories bc ON b.id = bc.book_id
      JOIN categories c ON bc.category_id = c.id
      LEFT JOIN categories cat ON bc.category_id = cat.id
      LEFT JOIN book_tags bt ON b.id = bt.book_id
      LEFT JOIN tags t ON bt.tag_id = t.id
      LEFT JOIN book_awards ba ON b.id = ba.book_id
      LEFT JOIN awards a ON ba.award_id = a.id
      WHERE c.name = ?
      GROUP BY b.id
      ORDER BY b.popularity DESC, b.rating DESC
      LIMIT ?
    `, [categoryName, limit]);

    return books.map((book: any) => {
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
    return await db.all('SELECT name, description FROM categories ORDER BY name');
  }

  async getTags(): Promise<{ name: string }[]> {
    const db = await getDatabase();
    return await db.all('SELECT name FROM tags ORDER BY name');
  }

  async getGenres(): Promise<{ genre: string; count: number }[]> {
    const db = await getDatabase();
    return await db.all(`
      SELECT genre, COUNT(*) as count 
      FROM books 
      WHERE genre IS NOT NULL 
      GROUP BY genre 
      ORDER BY count DESC
    `);
  }
} 