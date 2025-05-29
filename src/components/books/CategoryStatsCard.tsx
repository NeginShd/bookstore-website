'use client';

import { useState, useEffect } from 'react';
import { Star, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryStats } from '@/lib/categoryUtils';
import type { Book } from '@/lib/types';
import type { BookCategory } from './BookRowsSection';
import { categoryTitles } from './BookRowsSection';

interface CategoryStatsCardProps {
  category: BookCategory;
  className?: string;
}

export default function CategoryStatsCard({ category, className = '' }: CategoryStatsCardProps) {
  const [stats, setStats] = useState<ReturnType<typeof getCategoryStats> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryStats() {
      try {
        setLoading(true);
        
        // Fetch books for this category from API
        const response = await fetch(`/api/books?category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category books');
        }
        
        const data = await response.json();
        const books: Book[] = data.books || [];
        
        // Calculate stats from fetched books
        const categoryStats = getCategoryStats(books, category);
        setStats(categoryStats);
        
      } catch (error) {
        console.error(`Error fetching stats for ${category}:`, error);
        // Set default stats in case of error
        setStats({
          totalBooks: 0,
          averageRating: 0,
          totalReviews: 0,
          availableBooks: 0,
          priceRange: { min: 0, max: 0 }
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryStats();
  }, [category]);

  if (loading) {
    return <CategoryStatsCardSkeleton />;
  }

  if (!stats || stats.totalBooks === 0) {
    return null;
  }

  const title = categoryTitles[category];

  return (
    <Card className={`bg-gradient-to-br from-green-900/40 to-green-800/30 border-green-600/50 hover:border-green-500/70 transition-all duration-300 hover:scale-105 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-green-100 text-lg font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Total Books */}
        <div className="flex items-center justify-between">
          <span className="text-green-200 text-sm">تعداد کتاب‌ها:</span>
          <span className="text-green-100 font-bold">{stats.totalBooks.toLocaleString('fa-IR')}</span>
        </div>

        {/* Average Rating */}
        <div className="flex items-center justify-between">
          <span className="text-green-200 text-sm">میانگین امتیاز:</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-green-100 font-bold">
              {stats.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="flex items-center justify-between">
          <span className="text-green-200 text-sm">کل نظرات:</span>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-green-100 font-bold">
              {stats.totalReviews.toLocaleString('fa-IR')}
            </span>
          </div>
        </div>

        {/* Available Books */}
        <div className="flex items-center justify-between">
          <span className="text-green-200 text-sm">موجود:</span>
          <span className="text-green-400 font-bold">
            {stats.availableBooks.toLocaleString('fa-IR')} کتاب
          </span>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between">
          <span className="text-green-200 text-sm">محدوده قیمت:</span>
          <div className="text-left">
            <div className="text-green-100 font-bold text-xs">
              {Math.floor(stats.priceRange.min).toLocaleString('fa-IR')} - {Math.floor(stats.priceRange.max).toLocaleString('fa-IR')} تومان
            </div>
          </div>
        </div>

        {/* Popularity Indicator */}
        <div className="mt-4 pt-3 border-t border-green-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-green-200 text-sm">محبوبیت بالا</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component
const CategoryStatsCardSkeleton = () => (
  <Card className="bg-gradient-to-br from-green-900/40 to-green-800/30 border-green-600/50">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-green-600/30 rounded animate-pulse" />
        <div className="w-32 h-5 bg-green-600/30 rounded animate-pulse" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="w-20 h-4 bg-green-700/30 rounded animate-pulse" />
          <div className="w-16 h-4 bg-green-600/30 rounded animate-pulse" />
        </div>
      ))}
      <div className="mt-4 pt-3 border-t border-green-700/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600/30 rounded animate-pulse" />
          <div className="w-24 h-4 bg-green-700/30 rounded animate-pulse" />
        </div>
      </div>
    </CardContent>
  </Card>
); 