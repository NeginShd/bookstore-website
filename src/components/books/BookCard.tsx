import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useMemo } from 'react';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
  priority?: boolean;
  sizes?: string;
}

export default function BookCard({ 
  book, 
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Memoize IDs to prevent unnecessary re-renders
  const cardIds = useMemo(() => ({
    title: `book-title-${book.id}`,
    author: `book-author-${book.id}`
  }), [book.id]);
  
  // Optimize event handlers with useCallback
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const link = e.currentTarget.querySelector('a') as HTMLAnchorElement;
      if (link) link.click();
    }
  }, []);

  // Memoize truncated title for error fallback
  const truncatedTitle = useMemo(() => {
    return book.title.length > 20 ? `${book.title.substring(0, 20)}...` : book.title;
  }, [book.title]);

  return (
    <Card 
      className="flex flex-col overflow-hidden h-full bg-card border-2 border-border shadow-lg hover:shadow-green-400/40 hover:shadow-xl transition-all duration-300 ease-out hover:border-green-400/70 rounded-2xl backdrop-blur-md group will-change-transform relative"
      aria-labelledby={cardIds.title}
      aria-describedby={cardIds.author}
      role="article"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-green-400/0 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      
      <Link
        href={`/book/${book.id}`}
        className="block flex-grow focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none rounded-t-2xl relative z-10"
        aria-label={`مشاهده جزئیات کتاب ${book.title} نوشته ${book.author}`}
        tabIndex={-1}
      >
        <CardHeader className="p-2 sm:p-3 md:p-4 lg:p-5 pb-0 flex flex-col items-center">
          <div className="relative w-full aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden shadow-md group-hover:shadow-lg mb-2 sm:mb-3 lg:mb-5 min-h-[120px] max-h-[180px] xs:min-h-[140px] xs:max-h-[200px] sm:min-h-[160px] sm:max-h-[240px] md:min-h-[200px] md:max-h-[300px] lg:min-h-[240px] lg:max-h-[360px] xl:min-h-[260px] xl:max-h-[400px] bg-gray-100 dark:bg-gray-800 transition-shadow duration-300">
            
            {/* Enhanced loading skeleton with shimmer effect */}
            {imageLoading && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse"
                aria-label="در حال بارگذاری تصویر جلد کتاب"
                role="status"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <ImageIcon className="h-8 w-8 text-gray-400 z-10" aria-hidden="true" />
              </div>
            )}
            
            {/* Optimized error fallback */}
            {imageError ? (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-green-700 dark:text-green-300 p-4 transition-colors duration-300"
                role="img"
                aria-label={`تصویر جلد کتاب ${book.title} در دسترس نیست`}
              >
                <ImageIcon className="h-12 w-12 mb-2 group-hover:scale-105 transition-transform duration-300" aria-hidden="true" />
                <span className="text-xs text-center opacity-75 sr-only">
                  تصویر جلد برای کتاب {book.title} بارگذاری نشد
                </span>
                <span className="text-xs text-center opacity-75" aria-hidden="true">
                  {truncatedTitle}
                </span>
              </div>
            ) : (
              <Image
                src={book.coverImage}
                alt={`جلد کتاب ${book.title} نوشته ${book.author}`}
                fill={true}
                style={{ objectFit: 'cover' }}
                sizes={sizes}
                priority={priority}
                loading={priority ? undefined : 'lazy'}
                className={`rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-300 will-change-transform ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                data-ai-hint={book.dataAiHint || "book cover"}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyKzTGpTHU4Nc1+dGOqBE8ZhcKV7yjTcJeqWN8uWb7lh8vlQBcmOOp3Xk8/zRf0qQV1dWPzY/PT3vYa8uWEmLj4jqBJfnRMsLRx9CzNUMKmfBf+mZZ6hWKA"
              />
            )}

            {/* Hover overlay with book info preview */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl">
              <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                <p className="font-medium truncate">
                  {book.genre && `ژانر: ${book.genre}`}
                </p>
                {book.publishedYear && (
                  <p className="opacity-80">
                    سال: {book.publishedYear}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-2 sm:p-3 md:p-4 lg:p-5 pt-0 flex flex-col flex-grow justify-between gap-1 sm:gap-2 md:gap-3 lg:gap-4 relative z-10">
          <div className="space-y-1 sm:space-y-2 text-start">
            <CardTitle
              id={cardIds.title}
              className="text-sm sm:text-base md:text-lg font-extrabold mb-0 text-green-100 group-hover:text-green-300 transition-colors duration-300 leading-tight text-start"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              <span className="sr-only">عنوان کتاب: </span>
              {book.title}
            </CardTitle>
            <CardDescription
              id={cardIds.author}
              className="text-xs sm:text-sm md:text-base text-green-100 mb-0 font-bold transition-colors duration-300 group-hover:text-green-200 text-start"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              <span className="sr-only">نویسنده: </span>
              نوشته: {book.author}
            </CardDescription>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
