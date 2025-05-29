'use client';

import { useState } from 'react';
import CategoryStatsCard from '@/components/books/CategoryStatsCard';
import { categoryOrder, categoryTitles, type BookCategory } from '@/components/books/BookRowsSection';
import { Button } from '@/components/ui/button';
import { Grid, List, BarChart3 } from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'grid' | 'list' | 'stats';

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-100 drop-shadow-xl tracking-tight">
          دسته‌بندی‌های کتاب‌ها
        </h1>
        <p className="text-green-200 text-lg font-medium max-w-2xl mx-auto">
          کاوش در مجموعه‌های مختلف کتاب‌ها و مشاهده آمار هر دسته‌بندی
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-1 flex gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`${
              viewMode === 'grid' 
                ? 'bg-green-700 text-white' 
                : 'text-green-200 hover:text-green-100 hover:bg-green-800/50'
            }`}
          >
            <Grid className="h-4 w-4 mr-1" />
            شبکه‌ای
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={`${
              viewMode === 'list' 
                ? 'bg-green-700 text-white' 
                : 'text-green-200 hover:text-green-100 hover:bg-green-800/50'
            }`}
          >
            <List className="h-4 w-4 mr-1" />
            فهرستی
          </Button>
          <Button
            variant={viewMode === 'stats' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('stats')}
            className={`${
              viewMode === 'stats' 
                ? 'bg-green-700 text-white' 
                : 'text-green-200 hover:text-green-100 hover:bg-green-800/50'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            آماری
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'stats' && <StatsView />}

      {/* Back to Home */}
      <div className="text-center pt-8">
        <Link href="/">
          <Button variant="outline" className="border-green-600 text-green-200 hover:bg-green-800/50">
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Grid View Component
function GridView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categoryOrder.map((category) => (
        <Link
          key={category}
          href={`/genre/${category}`}
          className="group block transition-transform duration-200 hover:scale-105"
        >
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/30 border border-green-600/50 rounded-xl p-6 text-center hover:border-green-500/70 transition-all duration-300">
            <h3 className="text-xl font-bold text-green-100 mb-2 group-hover:text-green-300 transition-colors">
              {categoryTitles[category]}
            </h3>
            <p className="text-green-200 text-sm">
              کلیک کنید تا کتاب‌های این دسته را مشاهده کنید
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// List View Component
function ListView() {
  return (
    <div className="space-y-4">
      {categoryOrder.map((category, index) => (
        <Link
          key={category}
          href={`/genre/${category}`}
          className="group block"
        >
          <div className="bg-gradient-to-r from-green-900/40 to-green-800/30 border border-green-600/50 rounded-xl p-6 hover:border-green-500/70 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700/50 rounded-full flex items-center justify-center text-green-100 font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-100 group-hover:text-green-300 transition-colors">
                    {categoryTitles[category]}
                  </h3>
                  <p className="text-green-200 text-sm">
                    مجموعه‌ای از بهترین کتاب‌های این دسته
                  </p>
                </div>
              </div>
              <div className="text-green-300 group-hover:text-green-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Stats View Component
function StatsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {categoryOrder.map((category) => (
        <CategoryStatsCard key={category} category={category} />
      ))}
    </div>
  );
} 