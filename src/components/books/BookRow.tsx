'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/ui/category-badge';
import BookCard from './BookCard';
import type { Book } from '@/lib/types';

interface BookRowProps {
  title: string;
  books: Book[];
  loading?: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
  priority?: boolean;
  variant?: 'popular' | 'award' | 'special' | 'default';
}

export default function BookRow({ 
  title, 
  books, 
  loading = false, 
  showViewAll = false,
  onViewAll,
  priority = false,
  variant = 'default'
}: BookRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Memoize scroll check function
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Update scroll buttons on mount and when books change
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [books, checkScrollPosition]);

  // Optimized scroll functions
  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current && !isScrolling && scrollContainerRef.current.children[0]) {
      setIsScrolling(true);
      const firstCard = scrollContainerRef.current.children[0] as HTMLElement;
      const scrollAmount = firstCard.offsetWidth;
      
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      
      // Reduced timeout for better performance
      setTimeout(() => setIsScrolling(false), 200);
    }
  }, [isScrolling]);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current && !isScrolling && scrollContainerRef.current.children[0]) {
      setIsScrolling(true);
      const firstCard = scrollContainerRef.current.children[0] as HTMLElement;
      const scrollAmount = firstCard.offsetWidth;
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      setTimeout(() => setIsScrolling(false), 200);
    }
  }, [isScrolling]);

  // Memoize book count text
  const bookCountText = useMemo(() => {
    return books.length > 0 ? `${books.length} کتاب` : '';
  }, [books.length]);

  if (loading) {
    return <BookRowSkeleton title={title} />;
  }

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <section className="mb-4 sm:mb-6 lg:mb-8 group" aria-labelledby={`${title}-heading`}>
      {/* Enhanced Row Header with improved visual hierarchy */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4 px-1 sm:px-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 
            id={`${title}-heading`}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-green-100 drop-shadow-lg tracking-tight"
          >
            {title}
          </h2>
          {bookCountText && (
            <CategoryBadge
              category={bookCountText}
              variant={variant}
              size="sm"
            />
          )}
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* View All Button */}
          {showViewAll && onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-green-300 hover:text-green-100 hover:bg-green-800/30 transition-all duration-150 text-xs sm:text-sm font-medium px-2 sm:px-3"
            >
              <span className="hidden sm:inline">مشاهده همه</span>
              <span className="sm:hidden">همه</span>
              <MoreHorizontal className="ms-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
          
          {/* Navigation Buttons with improved mobile sizing */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft || isScrolling}
              className="bg-green-800/40 border-green-600/50 text-green-100 hover:bg-green-700/60 hover:border-green-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95 h-8 w-8 sm:h-9 sm:w-9 p-0"
              aria-label={`اسکرول به چپ برای ${title}`}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight || isScrolling}
              className="bg-green-800/40 border-green-600/50 text-green-100 hover:bg-green-700/60 hover:border-green-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95 h-8 w-8 sm:h-9 sm:w-9 p-0"
              aria-label={`اسکرول به راست برای ${title}`}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Container with improved responsive spacing */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2 px-1 sm:px-2 -mx-1 sm:-mx-2 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
          }}
          onScroll={checkScrollPosition}
          role="region"
          aria-label={`فهرست کتاب‌های ${title}`}
        >
          {books.map((book, index) => (
            <div
              key={book.id}
              className="flex-none w-36 xs:w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 scroll-snap-start"
              role="article"
              style={{
                scrollSnapAlign: 'start',
              }}
            >
              <BookCard 
                book={book} 
                priority={priority && index < 4}
                sizes="(max-width: 480px) 36vw, (max-width: 640px) 40vw, (max-width: 768px) 44vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
              />
            </div>
          ))}
        </div>
        
        {/* Enhanced Gradient Overlays with responsive sizing */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10 transition-opacity duration-200" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10 transition-opacity duration-200" />
        )}
        
        {/* Enhanced touch indicator for mobile */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 sm:hidden">
          <div className="flex gap-1 opacity-40">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Enhanced Skeleton component with better animations
const BookRowSkeleton = ({ title }: { title: string }) => (
  <section className="mb-4 sm:mb-6 lg:mb-8">
    <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4 px-1 sm:px-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-green-100 drop-shadow-lg">
          {title}
        </h2>
        <div className="w-12 sm:w-16 h-5 sm:h-6 bg-green-800/30 rounded-full animate-pulse" />
      </div>
      <div className="flex gap-1">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-800/30 rounded border animate-pulse" />
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-800/30 rounded border animate-pulse" />
      </div>
    </div>
    <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-hidden px-1 sm:px-2">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="flex-none w-36 xs:w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="bg-card border-2 border-border rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 animate-pulse">
            <div className="aspect-[2/3] bg-muted rounded-lg sm:rounded-xl mb-2 sm:mb-3 lg:mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="h-3 sm:h-4 bg-muted rounded w-3/4" />
              <div className="h-2 sm:h-3 bg-muted rounded w-1/2" />
              <div className="h-4 sm:h-5 md:h-6 bg-muted rounded w-1/3 mt-2 sm:mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
); 