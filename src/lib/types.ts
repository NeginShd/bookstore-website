import type { BookInsightsOutput } from '@/ai/flows/book-insights-flow';

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
}

export interface CartItem extends Book {
  quantity: number;
}
