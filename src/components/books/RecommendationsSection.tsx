'use client';

import { useEffect, useState } from 'react';
import { personalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import type { PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import type { Book } from '@/lib/types';
import BookCard from './BookCard';
import { books as allBooks } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for history - in a real app, this would be dynamic
const browsingHistory = "The Great Gatsby, To Kill a Mockingbird";
const purchaseHistory = "1984";

export default function RecommendationsSection() {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecs() {
      try {
        setLoading(true);
        setError(null);
        const result: PersonalizedRecommendationsOutput = await personalizedRecommendations({
          browsingHistory,
          purchaseHistory,
        });
        
        if (result && result.recommendations) {
          const recommendedTitles = result.recommendations.split(',').map(title => title.trim().toLowerCase());
          const booksToDisplay = allBooks.filter(book => 
            recommendedTitles.includes(book.title.toLowerCase()) &&
            !browsingHistory.toLowerCase().includes(book.title.toLowerCase()) &&
            !purchaseHistory.toLowerCase().includes(book.title.toLowerCase())
          );
          setRecommendedBooks(booksToDisplay);
        } else {
          setRecommendedBooks([]);
        }
      } catch (e) {
        setError('خطا در دریافت پیشنهادات.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, []); // browsingHistory and purchaseHistory are module-level constants, so no need to include them in deps.

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-center text-destructive py-4">{error}</p>;
  if (recommendedBooks.length === 0) return <p className="text-center text-muted-foreground py-4">در حال حاضر پیشنهادی برای شما وجود ندارد.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recommendedBooks.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md bg-card">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-10 w-full mt-2" />
  </div>
);
