export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverImage: string;
  price: number;
  description: string;
  genre: string;
  available: boolean;
  rating: number;
  reviewCount: number;
  categories: string[];
  publishedYear?: number;
  popularity: number;
  salesRank?: number;
  isHot: boolean;
  isNew: boolean;
  tags: string[];
  awards: string[];
  dataAiHint: string;
} 