import type { Book } from '@/lib/types';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onClearFilters?: () => void;
}

export default function BookList({ books, onClearFilters }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-green-50 via-white to-green-100 rounded-3xl shadow-inner border-2 border-green-100">
        <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4">
          <ellipse cx="32" cy="32" rx="28" ry="20" fill="#bbf7d0" />
          <path d="M20 40 Q32 28 44 40" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="32" rx="6" ry="3" fill="#22c55e" />
        </svg>
        <p className="text-center text-green-900 text-xl font-bold mb-2">کتابی یافت نشد!</p>
        <p className="text-center text-green-800 text-base mb-4">شاید لازم باشد فیلترها را پاک کنید یا جستجوی خود را گسترده‌تر کنید.</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-2 px-6 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-colors border border-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            پاک‌کردن فیلترها
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4 lg:p-6">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
