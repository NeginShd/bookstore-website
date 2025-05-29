import type { BookInsightsOutput } from '@/ai/flows/book-insights-flow';
import type { BookCategory } from '@/components/books/BookRowsSection';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  dataAiHint?: string; // Added optional dataAiHint for placeholder images
  price: number;
  description: string;
  genre: string;
  insights?: BookInsightsOutput;
  available?: boolean; // Mock: is the book in stock
  rating?: number; // Mock: average rating (1-5)
  reviewCount?: number; // Mock: number of reviews
  
  // New fields for categories and metadata
  categories?: BookCategory[]; // Multiple categories a book can belong to
  publishedYear?: number; // Publication year
  popularity?: number; // Popularity score (1-100)
  salesRank?: number; // Sales ranking
  isNew?: boolean; // Is this a new release (published in last 6 months)
  isHot?: boolean; // Is this currently trending/hot
  awards?: string[]; // List of awards this book has won
  tags?: string[]; // Additional tags for filtering
}

export interface CartItem extends Book {
  quantity: number;
}
