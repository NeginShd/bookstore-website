'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import BookList from '@/components/books/BookList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { Book } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import SortDropdown from '@/components/books/SortDropdown';

// Define genre mapping for titles (Persian display)
const genreDisplayNames: { [key: string]: string } = {
  'Fiction': 'داستانی',
  'Non-Fiction': 'غیرداستانی',
  'Classic': 'کلاسیک',
  'Dystopian': 'ویران‌شهری',
  'Self-Help': 'خودسازی',
  'Fantasy': 'فانتزی',
};

function GenrePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const genreNameFromUrl = decodeURIComponent(params.genreName as string || '');
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sortByFromUrl = searchParams.get('sortBy') || 'title';
  const orderFromUrl = searchParams.get('order') || 'asc';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [hasMore, setHasMore] = useState(true);
  const [totalBooks, setTotalBooks] = useState<number | null>(null);
  const [currentSortBy, setCurrentSortBy] = useState(sortByFromUrl);
  const [currentOrder, setCurrentOrder] = useState(orderFromUrl);

  const displayGenre = genreDisplayNames[genreNameFromUrl] || genreNameFromUrl;
  const LIMIT = 12;

  useEffect(() => {
    // Sync state with URL params
    setCurrentPage(pageFromUrl);
    setCurrentSortBy(sortByFromUrl);
    setCurrentOrder(orderFromUrl);
  }, [pageFromUrl, sortByFromUrl, orderFromUrl]);

  useEffect(() => {
    if (!genreNameFromUrl) {
        setError("نام ژانر مشخص نشده است.");
        setLoading(false);
        setBooks([]);
        setTotalBooks(0);
        return;
    }
    setLoading(true);
    setError(null);

    const apiParams = new URLSearchParams();
    apiParams.append('genre', genreNameFromUrl.toLowerCase()); // Ensure consistent casing for API
    apiParams.append('page', currentPage.toString());
    apiParams.append('limit', LIMIT.toString());
    apiParams.append('sortBy', currentSortBy);
    apiParams.append('order', currentOrder);

    fetch(`/api/books?${apiParams.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`خطا در دریافت کتاب‌های ژانر ${displayGenre}`);
        return res.json();
      })
      .then(data => {
        setBooks(prevBooks => currentPage === 1 ? data.books : [...prevBooks, ...data.books]);
        setTotalBooks(data.total);
        setHasMore(currentPage < data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        setBooks([]);
        setTotalBooks(0);
      });
  }, [genreNameFromUrl, currentPage, currentSortBy, currentOrder, displayGenre]);

  const handlePageChange = (newPage: number) => {
    const newUrlParams = new URLSearchParams(searchParams.toString());
    newUrlParams.set('page', newPage.toString());
    router.push(`/genre/${genreNameFromUrl}?${newUrlParams.toString()}`);
  };

  const handleSortChange = (sortBy: string, order: string) => {
    const newUrlParams = new URLSearchParams(searchParams.toString());
    newUrlParams.set('sortBy', sortBy);
    newUrlParams.set('order', order);
    newUrlParams.set('page', '1'); // Reset to page 1
    router.push(`/genre/${genreNameFromUrl}?${newUrlParams.toString()}`);
  };

  if (loading && books.length === 0 && currentPage === 1) {
    return <GenrePageSkeleton genreName={displayGenre} />;
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-6 bg-card rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-primary">کتاب‌های ژانر: {displayGenre}</h1>
      </section>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-2">
        {totalBooks !== null && (
            <p className="text-md text-muted-foreground mt-1 mb-2 sm:mb-0">
                {totalBooks.toLocaleString('fa-IR')} کتاب در این ژانر یافت شد
            </p>
        )}
        <SortDropdown onSortChange={handleSortChange} currentSortBy={currentSortBy} currentOrder={currentOrder} />
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-red-900/10 rounded-md">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-xl text-red-500">خطا: {error}</p>
        </div>
      )}
      {!loading && books.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center text-center py-20 min-h-[calc(100vh-30rem)]">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-bold mb-4">کتابی در ژانر &quot;{displayGenre}&quot; یافت نشد</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            متاسفانه در حال حاضر کتابی با این ژانر و فیلترهای انتخابی شما در فروشگاه موجود نیست.
          </p>
          <Link href="/" passHref>
            <Button size="lg">
              <ArrowRight className="ms-2 h-4 w-4" />
              بازگشت به صفحه اصلی
            </Button>
          </Link>
        </div>
      )}

      <BookList books={books} />
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={loading}
            size="lg"
          >
            {loading ? 'در حال بارگذاری...' : 'نمایش بیشتر'}
          </Button>
        </div>
      )}
      {!hasMore && books.length > 0 && (
         <div className="text-center text-muted-foreground mt-6 font-semibold">همه کتاب‌های این ژانر نمایش داده شد.</div>
      )}

      <div className="mt-12 text-center">
        <Link href="/" passHref>
          <Button variant="link" className="text-lg">
            <ArrowRight className="ms-2 h-5 w-5" />
            بازگشت به لیست همه‌ی کتاب‌ها
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function GenrePage() {
    return (
        <Suspense fallback={<GenrePageSkeleton />}>
            <GenrePageContent />
        </Suspense>
    );
}

const GenrePageSkeleton = ({ genreName }: { genreName?: string }) => (
  <div className="space-y-8">
    <section className="text-center py-6 bg-card rounded-xl shadow-md">
      <Skeleton className="h-10 w-1/2 mx-auto" />
    </section>
    <div className="flex justify-between items-center mb-6 px-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-[180px]" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md bg-card">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);
