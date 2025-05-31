import type { Book } from '@/lib/types';
import type { BookCategory } from '@/components/books/BookRowsSection';

/**
 * Get books for a specific category with optimized filtering and sorting
 */
export function getBooksForCategory(books: Book[], category: BookCategory, limit?: number): Book[] {
  let filteredBooks = books.filter(book => {
    if (!book.categories) return false;
    return book.categories.includes(category);
  });

  // Apply category-specific logic
  switch (category) {
    case 'hot-books':
      filteredBooks = filteredBooks
        .filter(book => book.isHot)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;

    case 'bestsellers':
      filteredBooks = filteredBooks
        .sort((a, b) => (a.salesRank || 999) - (b.salesRank || 999));
      break;

    case 'new-releases':
      const currentYear = new Date().getFullYear();
      filteredBooks = filteredBooks
        .filter(book => 
          book.isNew || 
          (book.publishedYear && book.publishedYear >= currentYear - 1)
        )
        .sort((a, b) => (b.publishedYear || 0) - (a.publishedYear || 0));
      break;

    case 'le-monde-100':
    case 'century-21-top-100':
      filteredBooks = filteredBooks
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;

    case 'man-booker':
    case 'houshang-golshiri':
      filteredBooks = filteredBooks
        .filter(book => book.awards && book.awards.length > 0)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;

    case 'best-children-books':
      filteredBooks = filteredBooks
        .filter(book => 
          book.genre === 'Children' || 
          book.genre === 'Fantasy' || 
          (book.tags && book.tags.includes('children'))
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;

    default:
      filteredBooks = filteredBooks
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  return limit ? filteredBooks.slice(0, limit) : filteredBooks;
}

/**
 * Get category statistics
 */
export function getCategoryStats(books: Book[], category: BookCategory) {
  const categoryBooks = getBooksForCategory(books, category);
  
  return {
    totalBooks: categoryBooks.length,
    averageRating: categoryBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / categoryBooks.length,
    totalReviews: categoryBooks.reduce((sum, book) => sum + (book.reviewCount || 0), 0),
    availableBooks: categoryBooks.filter(book => book.available).length,
    priceRange: {
      min: Math.min(...categoryBooks.map(book => book.price)),
      max: Math.max(...categoryBooks.map(book => book.price))
    }
  };
}

/**
 * Get recommended categories for a book
 */
export function getRecommendedCategories(book: Book): BookCategory[] {
  const recommendations: BookCategory[] = [];

  // Hot books criteria
  if (book.isHot || (book.popularity && book.popularity > 90)) {
    recommendations.push('hot-books');
  }

  // Bestsellers criteria
  if (book.salesRank && book.salesRank <= 50) {
    recommendations.push('bestsellers');
  }

  // New releases criteria
  const currentYear = new Date().getFullYear();
  if (book.isNew || (book.publishedYear && book.publishedYear >= currentYear - 1)) {
    recommendations.push('new-releases');
  }

  // Children's books criteria
  if (book.genre === 'Children' || 
      book.genre === 'Fantasy' || 
      (book.tags && book.tags.includes('children'))) {
    recommendations.push('best-children-books');
  }

  // Award categories
  if (book.awards) {
    if (book.awards.some((award: string) => award.toLowerCase().includes('booker'))) {
      recommendations.push('man-booker');
    }
    if (book.awards.some((award: string) => award.toLowerCase().includes('golshiri'))) {
      recommendations.push('houshang-golshiri');
    }
  }

  return recommendations;
}

/**
 * Search books across all categories
 */
export function searchBooksInCategories(
  books: Book[], 
  query: string, 
  categories?: BookCategory[]
): { [key in BookCategory]?: Book[] } {
  const results: { [key in BookCategory]?: Book[] } = {};
  const searchQuery = query.toLowerCase();

  const categoriesToSearch = categories || [
    'hot-books',
    'bestsellers',
    'new-releases',
    'le-monde-100',
    'century-21-top-100',
    'man-booker',
    'houshang-golshiri',
    'best-children-books'
  ];

  categoriesToSearch.forEach(category => {
    const categoryBooks = getBooksForCategory(books, category);
    const matchingBooks = categoryBooks.filter(book =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      (book.tags && book.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery))) ||
      book.description.toLowerCase().includes(searchQuery) ||
      (book.genre && book.genre.toLowerCase().includes(searchQuery)) ||
      (book.awards && book.awards.some((award: string) => award.toLowerCase().includes(searchQuery)))
    );

    if (matchingBooks.length > 0) {
      results[category] = matchingBooks;
    }
  });

  return results;
}

/**
 * Validate category
 */
export function isValidCategory(category: string): category is BookCategory {
  const validCategories: BookCategory[] = [
    'hot-books',
    'bestsellers',
    'new-releases',
    'le-monde-100',
    'century-21-top-100',
    'man-booker',
    'houshang-golshiri',
    'best-children-books'
  ];
  
  return validCategories.includes(category as BookCategory);
} 