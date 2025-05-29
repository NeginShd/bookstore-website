'use client';

import { useState, useEffect, useCallback } from 'react';
import BookRow from './BookRow';
import type { Book } from '@/lib/types';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import SectionHeader from '@/components/ui/section-header';

// تعریف انواع categories
export type BookCategory = 
  | 'hot-books'
  | 'bestsellers' 
  | 'new-releases'
  | 'le-monde-100'
  | 'century-21-top-100'
  | 'man-booker'
  | 'houshang-golshiri'
  | 'best-children-books';

// Mapping categories به عناوین فارسی
export const categoryTitles: Record<BookCategory, string> = {
  'hot-books': 'داغ‌ترین کتاب‌ها',
  'bestsellers': 'پرفروش‌ترین کتاب‌ها',
  'new-releases': 'جدیدترین کتاب‌ها',
  'le-monde-100': 'صد کتاب قرن لوموند',
  'century-21-top-100': 'صد کتاب برتر قرن ۲۱',
  'man-booker': 'جایزۀ من بوکر',
  'houshang-golshiri': 'جایزۀ هوشنگ گلشیری',
  'best-children-books': 'برترین کتاب‌های کودک'
};

// ترتیب نمایش categories با اولویت‌بندی و grouping
const categoryGroups = {
  popular: {
    title: 'محبوب‌ترین کتاب‌ها',
    subtitle: 'پرطرفدارترین و پرفروش‌ترین کتاب‌های روز',
    categories: ['hot-books', 'bestsellers', 'new-releases'] as BookCategory[],
    variant: 'popular' as const
  },
  awards: {
    title: 'برندگان جوایز معتبر',
    subtitle: 'کتاب‌های برگزیده از جوایز بین‌المللی و ملی',
    categories: ['le-monde-100', 'century-21-top-100', 'man-booker', 'houshang-golshiri'] as BookCategory[],
    variant: 'award' as const
  },
  special: {
    title: 'مجموعه‌های ویژه',
    subtitle: 'انتخابی از بهترین کتاب‌ها برای هر سنی',
    categories: ['best-children-books'] as BookCategory[],
    variant: 'special' as const
  }
};

const categoryOrder: BookCategory[] = [
  ...categoryGroups.popular.categories,
  ...categoryGroups.awards.categories,
  ...categoryGroups.special.categories
];

interface BookRowsSectionProps {
  className?: string;
  enableProgressiveLoading?: boolean;
}

interface CategoryData {
  category: BookCategory;
  books: Book[];
  loading: boolean;
  error: string | null;
  retryCount: number;
  loaded: boolean;
}

export default function BookRowsSection({ 
  className = '',
  enableProgressiveLoading = true 
}: BookRowsSectionProps) {
  const [categoriesData, setCategoriesData] = useState<Record<BookCategory, CategoryData>>(() => {
    // Initialize all categories with loading state
    return categoryOrder.reduce((acc, category) => {
      acc[category] = {
        category,
        books: [],
        loading: enableProgressiveLoading,
        error: null,
        retryCount: 0,
        loaded: false
      };
      return acc;
    }, {} as Record<BookCategory, CategoryData>);
  });

  const [visibleCategories, setVisibleCategories] = useState<Set<BookCategory>>(new Set());

  // Fetch books for a specific category with retry logic
  const fetchCategoryBooks = useCallback(async (category: BookCategory, isRetry = false) => {
    try {
      // Update loading state
      setCategoriesData(prev => ({
        ...prev,
        [category]: { 
          ...prev[category], 
          loading: true, 
          error: null,
          retryCount: isRetry ? prev[category].retryCount + 1 : prev[category].retryCount
        }
      }));

      // Make API call with category filter
      const params = new URLSearchParams({
        category,
        limit: '12', // Show 12 books per row
        page: '1'
      });

      const response = await fetch(`/api/books?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`امکان بارگذاری ${categoryTitles[category]} وجود ندارد. لطفاً مجدداً تلاش کنید.`);
      }

      const data = await response.json();
      
      setCategoriesData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          books: data.books || [],
          loading: false,
          error: null,
          loaded: true
        }
      }));

    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
      setCategoriesData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          books: [],
          loading: false,
          error: error instanceof Error ? error.message : 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
          loaded: false
        }
      }));
    }
  }, []);

  // Optimized progressive loading with reduced delay
  useEffect(() => {
    if (enableProgressiveLoading) {
      // Load popular categories first for better user experience
      const popularCategories = categoryGroups.popular.categories;
      const otherCategories = [...categoryGroups.awards.categories, ...categoryGroups.special.categories];
      
      // Load popular categories immediately
      popularCategories.forEach(category => {
        fetchCategoryBooks(category);
        setVisibleCategories(prev => new Set([...prev, category]));
      });
      
      // Load other categories with shorter delay
      otherCategories.forEach((category, index) => {
        setTimeout(() => {
          fetchCategoryBooks(category);
          setVisibleCategories(prev => new Set([...prev, category]));
        }, (index + 1) * 100);
      });
    } else {
      // Load all categories simultaneously
      categoryOrder.forEach(category => {
        fetchCategoryBooks(category);
        setVisibleCategories(prev => new Set([...prev, category]));
      });
    }
  }, [fetchCategoryBooks, enableProgressiveLoading]);

  // Retry function for failed categories
  const retryCategory = useCallback((category: BookCategory) => {
    fetchCategoryBooks(category, true);
  }, [fetchCategoryBooks]);

  // Handle view all for a category
  const handleViewAll = useCallback((category: BookCategory) => {
    // Navigate to category page or show modal
    window.location.href = `/genre/${category}`;
  }, []);

  const loadedCategoriesCount = Object.values(categoriesData).filter(data => data.loaded).length;
  const totalCategories = categoryOrder.length;

  return (
    <section 
      className={`space-y-8 lg:space-y-12 ${className}`}
      aria-labelledby="book-rows-heading"
    >
      {/* Enhanced Main Header */}
      <SectionHeader
        title="مجموعه‌های ویژه کتاب‌ها"
        subtitle="کاوش در بهترین کتاب‌های جهان، از پرطرفدارترین‌ها تا برندگان جوایز معتبر"
        size="lg"
      >
        {/* Improved Loading Progress Indicator */}
        {enableProgressiveLoading && loadedCategoriesCount < totalCategories && (
          <LoadingSpinner 
            text={`بارگذاری مجموعه‌ها... (${loadedCategoriesCount}/${totalCategories})`}
            className="mt-4"
          />
        )}
      </SectionHeader>

      {/* Render categories without grouping */}
      <div className="space-y-6 lg:space-y-8">
        {categoryOrder.map((category, index) => {
          const data = categoriesData[category];
          const title = categoryTitles[category];
          const isVisible = visibleCategories.has(category);

          // Don't render until visible (for progressive loading)
          if (enableProgressiveLoading && !isVisible) {
            return null;
          }

          // Show error state with improved UX
          if (data.error && !data.loading) {
            return (
              <ErrorMessage
                key={category}
                title={`خطا در بارگذاری ${title}`}
                message={data.error}
                onRetry={() => retryCategory(category)}
                retryCount={data.retryCount}
                className="mx-4"
                size="md"
              />
            );
          }

          // Show row (loading or with data) with improved animations
          return (
            <div
              key={category}
              className={`transition-all duration-300 ease-out ${
                data.loading && enableProgressiveLoading 
                  ? 'opacity-70 translate-y-4' 
                  : 'opacity-100 translate-y-0'
              }`}
              style={{
                // Staggered animation
                transitionDelay: enableProgressiveLoading ? `${index * 50}ms` : '0ms',
              }}
            >
              <BookRow
                title={title}
                books={data.books}
                loading={data.loading}
                showViewAll={data.books.length > 0}
                onViewAll={() => handleViewAll(category)}
                priority={index < 3} // First 3 categories get priority
                variant="default"
              />
            </div>
          );
        })}
      </div>

    </section>
  );
}

// Export utilities for use in other components
export { categoryOrder, categoryGroups }; 