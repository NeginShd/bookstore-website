import { NextResponse } from 'next/server';
import { BookService } from '@/lib/book-service';

export async function GET() {
  try {
    const bookService = BookService.getInstance();
    const books = await bookService.getAllBooks();
    
    // Return only the relevant information for image checking
    const bookInfo = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      coverImage: book.coverImage
    }));
    
    return NextResponse.json({ books: bookInfo });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 