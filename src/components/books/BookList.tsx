import type { Book } from '@/lib/types';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onClearFilters?: () => void;
}

export default function BookList({ books, onClearFilters }: BookListProps) {
  if (books.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center py-12 sm:py-16 bg-gradient-to-br from-green-50 via-white to-green-100 rounded-2xl sm:rounded-3xl shadow-inner border-2 border-green-100 mx-2 sm:mx-0"
        role="status"
        aria-live="polite"
      >
        <svg 
          width="48" 
          height="48" 
          fill="none" 
          viewBox="0 0 64 64" 
          className="mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16"
          aria-hidden="true"
        >
          <ellipse cx="32" cy="32" rx="28" ry="20" fill="#bbf7d0" />
          <path d="M20 40 Q32 28 44 40" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="32" rx="6" ry="3" fill="#22c55e" />
        </svg>
        <p className="text-center text-green-900 text-lg sm:text-xl font-bold mb-2">کتابی یافت نشد!</p>
        <p className="text-center text-green-800 text-sm sm:text-base mb-3 sm:mb-4 px-4">شاید لازم باشد فیلترها را پاک کنید یا جستجوی خود را گسترده‌تر کنید.</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-colors border border-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 text-sm sm:text-base"
            aria-label="پاک کردن همه فیلترها و نمایش تمام کتاب‌ها"
          >
            پاک‌کردن فیلترها
          </button>
        )}
      </div>
    );
  }

  return (
    <section 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 p-2 sm:p-4 lg:p-6"
      aria-label={`فهرست ${books.length.toLocaleString('fa-IR')} کتاب`}
      role="region"
    >
      {books.map((book, index) => (
        <div key={book.id} className="w-full">
          <BookCard 
            book={book} 
            priority={index < 8}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
          />
        </div>
      ))}
    </section>
  );
}
