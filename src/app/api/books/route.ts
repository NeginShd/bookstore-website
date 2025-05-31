import { NextResponse } from 'next/server';
import { BookService } from '@/lib';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('search')?.toLowerCase() || '';
  const genre = searchParams.get('genre')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const sortBy = searchParams.get('sortBy') || 'title';
  const order = searchParams.get('order') || 'asc';

  try {
    console.log(`API request: ${request.url}`);
    console.log(`Params: id=${id}, query=${query}, genre=${genre}, category=${category}, page=${page}, limit=${limit}`);
    
    const bookService = BookService.getInstance();

    // Fetch by ID
    if (id) {
      console.log(`Fetching book by ID: ${id}`);
      const book = await bookService.getBookById(id);
      if (book) {
        return NextResponse.json(book);
      } else {
        console.error(`Book not found with ID: ${id}`);
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
    }

    // Search books with filters
    console.log(`Searching books with filters`);
    const result = await bookService.searchBooks(
      query || undefined,
      genre || undefined, 
      category || undefined,
      page,
      limit,
      sortBy,
      order
    );

    console.log(`Found ${result.books.length} books out of ${result.total} total`);
    
    if (result.books.length === 0) {
      console.log('No books found with the current filters');
    }

    return NextResponse.json({
      books: result.books,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      category: category || null,
      appliedFilters: {
        category: category || null,
        genre: genre || null,
        search: query || null,
        sortBy,
        order
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 