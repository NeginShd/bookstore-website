import { NextResponse } from 'next/server';
import { BookService } from '@/lib/book-service';

export async function GET() {
  try {
    const bookService = BookService.getInstance();
    const genres = await bookService.getGenres();
    
    return NextResponse.json({ genres });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 