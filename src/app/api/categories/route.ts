import { NextResponse } from 'next/server';
import { BookService } from '@/lib/services/book-service';

export async function GET() {
  try {
    const bookService = BookService.getInstance();
    const categories = await bookService.getCategories();
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 