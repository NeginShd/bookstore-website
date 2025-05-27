'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookList from '@/components/books/BookList';
import RecommendationsSection from '@/components/books/RecommendationsSection';
import type { Book } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import SearchBar from '@/components/books/SearchBar';
import SortDropdown from '@/components/books/SortDropdown';

function SearchAwareHomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryFromUrl = searchParams.get('search') || '';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sortByFromUrl = searchParams.get('sortBy') || 'title';
  const orderFromUrl = searchParams.get('order') || 'asc';

  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [hasMore, setHasMore] = useState(true);
  const [totalBooks, setTotalBooks] = useState<number | null>(null);
  const [currentSortBy, setCurrentSortBy] = useState(sortByFromUrl);
  const [currentOrder, setCurrentOrder] = useState(orderFromUrl);

  const LIMIT = 12;

  useEffect(() => {
    setSearchTerm(queryFromUrl);
    setCurrentPage(pageFromUrl);
    setCurrentSortBy(sortByFromUrl);
    setCurrentOrder(orderFromUrl);
  }, [queryFromUrl, pageFromUrl, sortByFromUrl, orderFromUrl]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (queryFromUrl) params.append('search', queryFromUrl);
    params.append('page', currentPage.toString());
    params.append('limit', LIMIT.toString());
    params.append('sortBy', currentSortBy);
    params.append('order', currentOrder);

    fetch(`/api/books?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('خطا در دریافت داده‌ها از سرور');
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
  }, [queryFromUrl, currentPage, currentSortBy, currentOrder]);

  const handleSearch = (newQuery: string) => {
    setSearchTerm(newQuery);
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', newQuery);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (sortBy: string, order: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.set('order', order);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  if (loading && books.length === 0 && currentPage === 1) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="space-y-12">
      <section className="relative text-center py-16 rounded-3xl shadow-2xl bg-gradient-to-br from-[#022d2bcc] via-green-900/80 to-green-800/80 border-2 border-green-900/40 backdrop-blur-xl overflow-hidden flex flex-col items-center">
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20 blur-lg pointer-events-none select-none">
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="110" cy="60" rx="100" ry="40" fill="#22c55e" />
          </svg>
        </span>
        <h1 className="text-5xl font-black mb-2 text-green-100 drop-shadow-xl tracking-tight">به سبز خوش آمدید!</h1>
        <p className="text-xl text-green-200 mb-8 font-semibold drop-shadow-xl">کتاب مورد علاقه بعدی خود را در دنیای سبز کشف کنید.</p>
        <div className="w-full max-w-2xl mb-8">
          <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />
        </div>
        {queryFromUrl && (
          <p className="text-lg text-green-200 mb-4 font-bold drop-shadow-xl">
            نتایج جستجو برای: <span className="font-extrabold text-green-400">{queryFromUrl}</span>
          </p>
        )}
      </section>

      <section>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-black text-green-100 drop-shadow-xl tracking-tight border-b-2 border-green-400 pb-2 inline-block">{queryFromUrl ? 'نتایج جستجو' : 'کتاب‌های ویژه'}</h2>
            {totalBooks !== null && (
              <p className="text-md text-green-200 mt-1 font-semibold drop-shadow-xl">
                {totalBooks.toLocaleString('fa-IR')} کتاب یافت شد
              </p>
            )}
          </div>
          <SortDropdown onSortChange={handleSortChange} currentSortBy={currentSortBy} currentOrder={currentOrder} />
        </div>
        {error && <div className="text-red-500 text-center py-4 bg-red-900/20 rounded-md">خطا: {error}</div>}
        {!loading && books.length === 0 && !error && (
          <div className="text-center text-xl text-green-300 py-10 bg-green-900/20 rounded-md">
            <p>متاسفانه کتابی با مشخصات مورد نظر شما یافت نشد.</p>
            <p className="text-sm mt-2">لطفاً عبارت جستجو یا فیلترهای خود را تغییر دهید.</p>
          </div>
        )}
        <BookList books={books} />
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-8 py-3 rounded-xl bg-green-700 text-white font-bold shadow hover:bg-green-800 transition-colors border border-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'در حال بارگذاری موارد بیشتر...' : 'نمایش بیشتر'}
            </button>
          </div>
        )}
        {!hasMore && books.length > 0 && (
          <div className="text-center text-green-400 mt-6 font-bold">همه کتاب‌های مطابق با جستجوی شما نمایش داده شد.</div>
        )}
      </section>

      <RecommendationsSection />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <SearchAwareHomePageContent />
    </Suspense>
  );
}

const HomePageSkeleton = () => (
  <div className="space-y-12">
    <section className="text-center py-8 bg-card rounded-xl shadow-md">
      <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
      <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
    </section>
    <section>
      <Skeleton className="h-8 w-1/3 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md bg-card">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </section>
    <section>
      <Skeleton className="h-8 w-1/2 mb-6" />
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md bg-card">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </section>
  </div>
);
