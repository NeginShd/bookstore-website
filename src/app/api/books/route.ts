import { NextResponse } from 'next/server';
import { books as allBooksData } from '@/lib/data'; // Assuming this is the path to your static data
import type { Book } from '@/lib/types'; // Assuming this is the path to your Book type

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('search')?.toLowerCase() || '';
  const genre = searchParams.get('genre')?.toLowerCase() || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const sortBy = searchParams.get('sortBy') || 'title'; // Default sort by title
  const order = searchParams.get('order') || 'asc'; // Default order ascending

  let books: Book[] = [...allBooksData];

  // Fetch by ID
  if (id) {
    const bookById = books.find(b => b.id === id);
    if (bookById) {
      return NextResponse.json(bookById);
    } else {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
  }

  // Filter by genre
  if (genre) {
    books = books.filter(book => book.genre.toLowerCase() === genre);
  }

  // Filter by search query (title, author, isbn)
  if (query) {
    books = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.isbn && book.isbn.toLowerCase().includes(query))
    );
  }

  // Sort
  books.sort((a, b) => {
    let valA: any;
    let valB: any;

    if (sortBy === 'price') {
      valA = a.price;
      valB = b.price;
    } else if (sortBy === 'title') {
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    } else if (sortBy === 'author') {
      valA = a.author.toLowerCase();
      valB = b.author.toLowerCase();
    } else {
      // default to title if sortBy is unknown
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    }
    
    if (valA < valB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const total = books.length;
  const paginatedBooks = books.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    books: paginatedBooks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
} 