import type { Book } from './types';

// Client-side compatible book fetching
export async function getBooks(): Promise<Book[]> {
  if (typeof window !== 'undefined') {
    // Client-side: fetch from API
    try {
      const response = await fetch('/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      return data.books || [];
    } catch (error) {
      console.error('Error fetching books on client:', error);
      return [];
    }
  } else {
    // Server-side: use BookService directly
    try {
      const { BookService } = await import('./book-service');
      const bookService = BookService.getInstance();
      return await bookService.getAllBooks();
    } catch (error) {
      console.error('Error fetching books on server:', error);
      return [];
    }
  }
}

// Export an empty array for initial load (will be replaced by async fetch)
export const books: Book[] = [];

// Re-export BookService for server-side use only
export async function getBookService() {
  if (typeof window !== 'undefined') {
    throw new Error('BookService can only be used on the server side');
  }
  const { BookService } = await import('./book-service');
  return BookService;
}
