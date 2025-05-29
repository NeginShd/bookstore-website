'use client';

import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isLoading?: boolean;
  resultsCount?: number;
}

// Custom debounce hook
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export default function SearchBar({ onSearch, initialQuery = '', isLoading = false, resultsCount }: SearchBarProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [isSearching, setIsSearching] = React.useState(false);
  const searchInputId = React.useId();
  const statusId = React.useId();

  // Debounced search function with 300ms delay
  const debouncedSearch = useDebounce((searchQuery: string) => {
    setIsSearching(true);
    onSearch(searchQuery);
    // Reset searching state after a short delay
    setTimeout(() => setIsSearching(false), 500);
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    
    // Call debounced search instead of immediate search
    debouncedSearch(newQuery);
  };

  // Update local state when initialQuery changes (for URL sync)
  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const showLoading = isLoading || isSearching;

  // Create status message for screen readers
  const getStatusMessage = () => {
    if (showLoading) {
      return 'در حال جستجو...';
    }
    if (query && resultsCount !== undefined) {
      return `${resultsCount.toLocaleString('fa-IR')} نتیجه برای "${query}" یافت شد`;
    }
    return '';
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <label htmlFor={searchInputId} className="sr-only">
        جستجوی کتاب در فروشگاه
      </label>
      <Input
        id={searchInputId}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="جستجوی کتاب..."
        className="pe-12 sm:pe-14 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl font-medium bg-white/95 text-gray-900 placeholder:text-gray-500 shadow-lg border-2 border-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/60 focus:bg-white transition-all duration-200 hover:shadow-xl hover:bg-white text-start"
        aria-label="جستجوی کتاب در فروشگاه"
        aria-describedby={statusId}
        aria-expanded={!!query}
        aria-autocomplete="list"
        role="searchbox"
        disabled={isLoading}
        autoComplete="off"
        dir="rtl"
      />
      <span 
        className="absolute end-4 sm:end-5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      >
        {showLoading ? (
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 animate-spin" />
        ) : (
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
        )}
      </span>
      
      {/* Live region for screen reader announcements */}
      <div
        id={statusId}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {getStatusMessage()}
      </div>
    </div>
  );
}
