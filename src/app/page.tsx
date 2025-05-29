'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookList from '@/components/books/BookList';
import BookRowsSection from '@/components/books/BookRowsSection';
import RecommendationsSection from '@/components/books/RecommendationsSection';
import TouchScrollIndicator from '@/components/ui/touch-scroll-indicator';
import type { Book } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import SearchBar from '@/components/books/SearchBar';
import SortDropdown from '@/components/books/SortDropdown';
import Link from 'next/link';

function SearchAwareHomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryFromUrl = searchParams.get('search') || '';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sortByFromUrl = searchParams.get('sortBy') || 'title';
  const orderFromUrl = searchParams.get('order') || 'asc';

  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [hasMore, setHasMore] = useState(true);
  const [totalBooks, setTotalBooks] = useState<number | null>(null);
  const [currentSortBy, setCurrentSortBy] = useState(sortByFromUrl);
  const [currentOrder, setCurrentOrder] = useState(orderFromUrl);
  const [showTouchIndicator, setShowTouchIndicator] = useState(false);

  const LIMIT = 12;

  useEffect(() => {
    setSearchTerm(queryFromUrl);
    setCurrentPage(pageFromUrl);
    setCurrentSortBy(sortByFromUrl);
    setCurrentOrder(orderFromUrl);
  }, [queryFromUrl, pageFromUrl, sortByFromUrl, orderFromUrl]);

  // Only fetch search results when there's a search query
  useEffect(() => {
    if (!queryFromUrl) {
      setBooks([]);
      setLoading(false);
      setTotalBooks(null);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append('search', queryFromUrl);
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

  // Show touch indicator on mobile after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTouchIndicator(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (newQuery: string) => {
    setSearchTerm(newQuery);
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery) {
      params.set('search', newQuery);
    } else {
      params.delete('search');
    }
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

  const clearSearch = () => {
    setSearchTerm('');
    router.push('/');
  };

  // Show search results if there's a query
  if (queryFromUrl) {
    if (loading && books.length === 0 && currentPage === 1) {
      return <SearchResultsSkeleton query={queryFromUrl} />;
    }

    return (
      <div className="space-y-8">
        {/* Hero Section with Search */}
        <HeroSection 
          onSearch={handleSearch} 
          initialQuery={searchTerm}
          isLoading={loading}
          resultsCount={totalBooks || 0}
        />

        {/* Search Results */}
        <main className="space-y-6">
          <div className="mb-6 p-4 bg-green-900/20 rounded-xl border border-green-700/30">
            <div className="flex items-center justify-between">
              <p className="text-lg text-green-100 font-medium">
                نتایج جستجو برای: <span className="font-bold text-green-300">"{queryFromUrl}"</span>
              </p>
              <button
                onClick={clearSearch}
                className="text-green-300 hover:text-green-100 text-sm underline"
              >
                پاک کردن جستجو
              </button>
            </div>
            {totalBooks !== null && (
              <p className="text-md text-green-200 mt-1 font-semibold">
                {totalBooks.toLocaleString('fa-IR')} کتاب یافت شد
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-green-100 drop-shadow-xl tracking-tight border-b-2 border-green-400 pb-2 inline-block">
              نتایج جستجو
            </h2>
            <SortDropdown onSortChange={handleSortChange} currentSortBy={currentSortBy} currentOrder={currentOrder} />
          </div>

          {error && (
            <div className="text-red-500 text-center py-4 bg-red-900/20 rounded-md" role="alert">
              خطا: {error}
            </div>
          )}

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
            <div className="text-center text-green-400 mt-6 font-bold">
              همه کتاب‌های مطابق با جستجوی شما نمایش داده شد.
            </div>
          )}
        </main>
      </div>
    );
  }

  // Default home page with book rows
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection 
        onSearch={handleSearch} 
        initialQuery={searchTerm}
        isLoading={loading}
        resultsCount={0}
      />

      {/* Book Rows Section */}
      <BookRowsSection enableProgressiveLoading={true} />

      {/* Recommendations Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-100 drop-shadow-xl tracking-tight mb-3">
            پیشنهادات ویژه برای شما
          </h2>
          <p className="text-green-200 text-lg font-medium">
            بر اساس علایق و تاریخچه مطالعه شما
          </p>
        </div>
        <RecommendationsSection />
      </section>

      {/* Touch Scroll Indicator for Mobile */}
      <TouchScrollIndicator 
        show={showTouchIndicator} 
        direction="horizontal"
      />
    </div>
  );
}

// Hero Section Component
function HeroSection({ 
  onSearch, 
  initialQuery, 
  isLoading, 
  resultsCount 
}: {
  onSearch: (query: string) => void;
  initialQuery: string;
  isLoading: boolean;
  resultsCount: number;
}) {
  return (
    <section 
      className="relative text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-emerald-900/95 via-green-800/90 to-green-700/85 border border-green-600/30 overflow-hidden flex flex-col items-center"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <h1 
        id="hero-heading"
        className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 lg:mb-2 text-white tracking-tight drop-shadow-lg"
      >
        به کتاب‌فروشی هوشمند سبز خوش آمدید!
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-green-50 mb-6 sm:mb-7 lg:mb-8 font-medium drop-shadow-md max-w-2xl mx-auto">
        کتاب مورد علاقه بعدی خود را در دنیای سبز کشف کنید.
      </p>
      <div className="w-full max-w-xl lg:max-w-2xl mb-6 sm:mb-7 lg:mb-8">
        <SearchBar 
          onSearch={onSearch} 
          initialQuery={initialQuery} 
          isLoading={isLoading}
          resultsCount={resultsCount}
        />
      </div>
      
      {/* Primary CTAs */}
      <nav 
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        aria-label="دسترسی سریع"
      >
        <Link 
          href="/books" 
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-green-800 font-bold text-base sm:text-lg rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800 min-w-[200px]"
        >
          مشاهده کتاب‌های محبوب
        </Link>
        <Link 
          href="/books" 
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-semibold text-base sm:text-lg rounded-xl border-2 border-white/80 hover:bg-white/10 hover:border-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800 min-w-[200px]"
        >
          دسته‌بندی‌ها
        </Link>
      </nav>
    </section>
  );
}

// Search Results Skeleton
function SearchResultsSkeleton({ query }: { query: string }) {
  return (
    <div className="space-y-8">
      <HeroSection onSearch={() => {}} initialQuery={query} isLoading={true} resultsCount={0} />
      <div className="mb-6 p-4 bg-green-900/20 rounded-xl border border-green-700/30">
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <Skeleton className="h-8 w-48 mb-4 sm:mb-0" />
        <Skeleton className="h-10 w-32" />
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
      <Skeleton className="h-12 w-96 mx-auto mb-6" />
      <div className="flex gap-4 justify-center">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-12 w-48" />
      </div>
    </section>
    
    {/* Book Rows Skeleton */}
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="flex-none w-48">
                <Skeleton className="h-72 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
