'use client'; // This page needs to be a client component to fetch data or use hooks

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { books } from '@/lib/data'; // Removed static data import
import type { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookOpen, FileText, Tag, Info, AlertTriangle, Sparkles, PackageCheck, PackageX } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import { BookActions } from '@/components/books/BookActions';

// Removed generateStaticParams as we will fetch dynamically
// If you still need SSG for some book pages, this needs a different approach with the API.

interface BookDetailPageProps {
  params: { id: string };
}

const BookDetailSkeleton = () => (
  <div className="container mx-auto max-w-4xl py-8 px-4">
    <Card className="overflow-hidden shadow-sm">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative h-96 md:h-auto min-h-[300px] bg-muted/30 flex items-center justify-center p-4 md:p-8">
          <Skeleton className="w-[300px] h-[450px] rounded-md" />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <CardHeader className="px-0 pt-0 pb-4">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-5 w-1/3 mb-4" />
              <Separator className="my-4" />
              <Skeleton className="h-20 w-full mb-4" /> 
              <Separator className="my-4" />
              <Skeleton className="h-10 w-1/4" />
            </CardContent>
          </div>
          <div className="mt-6">
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </Card>
    {/* ... other skeleton parts if needed ... */}
  </div>
);

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      setError(null);
      fetch(`/api/books?id=${params.id}`)
        .then(res => {
          if (!res.ok) {
            if (res.status === 404) throw new Error('کتاب مورد نظر یافت نشد!');
            throw new Error('خطا در دریافت اطلاعات کتاب');
          }
          return res.json();
        })
        .then(data => {
          setBook(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <BookDetailSkeleton />;
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 min-h-[calc(100vh-20rem)]">
        <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-destructive">
          {error || 'کتاب مورد نظر یافت نشد!'} 
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          متاسفانه مشکلی در بارگذاری اطلاعات کتاب پیش آمده یا کتابی با این مشخصات در فروشگاه ما موجود نیست.
        </p>
        <Link href="/" passHref>
          <Button size="lg">
            <ArrowRight className="ms-2 h-4 w-4" />
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </div>
    );
  }

  // Assume a stock property might exist on the book object from the API in the future
  const stockStatus = book.stock === undefined ? 'unknown' : (book.stock > 0 ? 'inStock' : 'outOfStock');

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-96 md:h-auto min-h-[300px] bg-muted/30 flex items-center justify-center p-4 md:p-8">
            <Image
              src={book.coverImage || '/default-cover.png'} // Fallback for cover image
              alt={`جلد کتاب ${book.title}`}
              width={300}
              height={450}
              style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%'}}
              className="rounded-md shadow-lg"
              priority // Consider removing priority if many images load, or set based on LCP
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-3xl font-bold text-primary mb-2">{book.title}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  نوشته: {book.author}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 space-y-4">
                <div className="flex items-center text-md">
                  <Tag className="ms-2 h-5 w-5 text-secondary" />
                  <span className="font-semibold me-2">ژانر:</span>
                  <span>{book.genre}</span>
                </div>
                <div className="flex items-center text-md">
                  <Info className="ms-2 h-5 w-5 text-secondary" />
                  <span className="font-semibold me-2">شابک:</span>
                  <span>{book.isbn || 'نامشخص'}</span>
                </div>
                
                {/* Stock Status Display */}
                <div className="flex items-center text-md">
                  {stockStatus === 'inStock' && <PackageCheck className="ms-2 h-5 w-5 text-green-500" />}
                  {stockStatus === 'outOfStock' && <PackageX className="ms-2 h-5 w-5 text-red-500" />}
                  {stockStatus === 'unknown' && <Info className="ms-2 h-5 w-5 text-gray-400" />}
                  <span className="font-semibold me-2">وضعیت موجودی:</span>
                  <span>
                    {stockStatus === 'inStock' && `موجود (تعداد: ${book.stock})`}
                    {stockStatus === 'outOfStock' && 'ناموجود'}
                    {stockStatus === 'unknown' && 'نامشخص'} 
                  </span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center text-primary">
                        <FileText className="ms-2 h-5 w-5" />
                        توضیحات کتاب
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-justify">{book.description || 'توضیحات موجود نیست.'}</p>
                </div>
                
                <Separator className="my-4" />

                <p className="text-3xl font-extrabold text-primary py-2">
                  {book.price ? book.price.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR' }).replace('IRR', 'ریال') : 'قیمت نامشخص'}
                </p>
              </CardContent>
            </div>
            
            <div className="mt-6">
              <BookActions book={book} disabled={stockStatus === 'outOfStock'} />
              <Link href="/cart" passHref>
                <Button variant="outline" className="w-full mt-3">
                  مشاهده سبد خرید
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {book.insights && (book.insights.summary || book.insights.keyThemes?.length > 0 || book.insights.targetAudience) && (
        <Card className="mt-10 shadow-sm rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-semibold text-primary">
              <Sparkles className="ms-2 h-6 w-6" />
              تحلیل هوشمند کتاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              {book.insights.summary && (
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl hover:no-underline">خلاصه کتاب</AccordionTrigger>
                  <AccordionContent className="pt-2 text-base leading-relaxed text-foreground/80 text-justify">
                    {book.insights.summary}
                  </AccordionContent>
                </AccordionItem>
              )}
              {book.insights.keyThemes && book.insights.keyThemes.length > 0 && (
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xl hover:no-underline">موضوعات کلیدی</AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ul className="list-disc list-inside space-y-1 text-base text-foreground/80">
                      {book.insights.keyThemes.map((theme, index) => (
                        <li key={index}>{theme}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
              {book.insights.targetAudience && (
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-xl hover:no-underline">مخاطب هدف</AccordionTrigger>
                  <AccordionContent className="pt-2 text-base leading-relaxed text-foreground/80 text-justify">
                    {book.insights.targetAudience}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      )}

      <div className="mt-12 text-center">
        <Link href="/" passHref>
          <Button variant="link" className="text-lg">
            <ArrowRight className="ms-2 h-5 w-5" />
            بازگشت به لیست کتاب‌ها
          </Button>
        </Link>
      </div>
    </div>
  );
}
