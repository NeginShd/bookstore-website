import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AddToCartButton from './AddToCartButton';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const cardTitleId = `book-title-${book.id}`;
  const cardAuthorId = `book-author-${book.id}`;
  return (
    <Link
      href={`/book/${book.id}`}
      className="block h-full group focus-visible:ring-2 focus-visible:ring-green-400 outline-none"
      aria-label={`مشاهده جزئیات کتاب ${book.title} نوشته ${book.author}`}
      aria-labelledby={cardTitleId}
      title={`مشاهده جزئیات کتاب ${book.title} نوشته ${book.author}`}
    >
      <Card className="flex flex-col overflow-hidden h-full bg-card border-2 border-border shadow-lg hover:shadow-green-400/30 hover:scale-105 transition-all duration-300 ease-in-out hover:border-green-400/70 rounded-2xl backdrop-blur-md">
        <CardHeader className="p-3 sm:p-5 pb-0 flex flex-col items-center">
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-3 sm:mb-5 min-h-[140px] max-h-[220px] sm:min-h-[180px] sm:max-h-[320px] md:min-h-[240px] md:max-h-[400px] lg:min-h-[260px] lg:max-h-[440px]">
            <Image
              src={book.coverImage}
              alt={`جلد کتاب ${book.title} نوشته ${book.author}`}
              fill={true}
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={book.id === '1' || book.id === '2' || book.id === '3' || book.id === '4'}
              loading={book.id === '1' || book.id === '2' || book.id === '3' || book.id === '4' ? undefined : 'lazy'}
              className="rounded-xl group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={book.dataAiHint || "book cover"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 flex flex-col flex-grow justify-between gap-2 sm:gap-4">
          <CardTitle
            id={cardTitleId}
            className="text-base sm:text-lg font-extrabold mb-0 line-clamp-2 text-green-100 group-hover:text-green-300 transition-colors text-right"
            title={book.title}
          >
            {book.title}
          </CardTitle>
          <CardDescription
            id={cardAuthorId}
            className="text-sm sm:text-base text-green-100 mb-0 line-clamp-1 font-bold text-right"
            title={book.author}
          >
            {book.author}
          </CardDescription>
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mt-2 gap-2 xs:gap-0">
            <span className="inline-block bg-green-800/60 text-green-100 font-extrabold px-3 sm:px-4 py-1 rounded-full shadow-sm text-sm sm:text-base border-2 border-green-500/50">{book.price.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR' }).replace('IRR', 'ریال')}</span>
            {typeof book.available === 'boolean' && (
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ml-2 ${book.available ? 'text-green-400 bg-green-900/40 border-green-700' : 'text-red-400 bg-red-900/40 border-red-700'}`}>
                {book.available ? 'موجود' : 'ناموجود'}
              </span>
            )}
          </div>
          {(typeof book.rating === 'number' && typeof book.reviewCount === 'number') ? (
            <div className="flex items-center justify-center gap-1 mt-1 mb-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-4 w-4" fill={book.rating && book.rating >= i ? '#facc15' : 'none'} stroke={book.rating && book.rating >= i ? '#facc15' : 'currentColor'} />
              ))}
              <span className="text-xs text-green-200 mr-1">({book.reviewCount?.toLocaleString('fa-IR')})</span>
            </div>
          ) : null}
          <AddToCartButton book={book} />
        </CardContent>
      </Card>
    </Link>
  );
}
