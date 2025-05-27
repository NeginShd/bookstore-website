'use client';

import React, { useEffect, useState } from 'react';
import type { BookInsightsOutput } from '@/ai/flows/book-insights-flow';
import { generateBookInsights } from '@/ai/flows/book-insights-flow';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Sparkles } from 'lucide-react';

interface Props {
  book: Book;
}

export default function BookInsightsClient({ book }: Props) {
  const [insights, setInsights] = useState<BookInsightsOutput | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      setInsightsLoading(true);
      setInsightsError(null);
      try {
        const result = await generateBookInsights({
          title: book.title,
          author: book.author,
          description: book.description,
        });
        setInsights(result);
      } catch (error) {
        console.error('Error fetching book insights:', error);
        setInsightsError('متاسفانه در دریافت تحلیل هوشمند کتاب خطایی رخ داد.');
      } finally {
        setInsightsLoading(false);
      }
    }

    if (book) {
      fetchInsights();
    }
  }, [book]);

  return (
    <Card className="mt-10 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold text-primary">
          <Sparkles className="ms-2 h-6 w-6" />
          تحلیل هوشمند کتاب
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insightsLoading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Separator className="my-4" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        {insightsError && <p className="text-destructive text-center py-4">{insightsError}</p>}
        {insights && !insightsLoading && !insightsError && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl hover:no-underline">خلاصه کتاب</AccordionTrigger>
              <AccordionContent className="pt-2 text-base leading-relaxed text-foreground/80 text-justify">
                {insights.summary}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl hover:no-underline">موضوعات کلیدی</AccordionTrigger>
              <AccordionContent className="pt-2">
                <ul className="list-disc list-inside space-y-1 text-base text-foreground/80">
                  {insights.keyThemes.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl hover:no-underline">مخاطب هدف</AccordionTrigger>
              <AccordionContent className="pt-2 text-base leading-relaxed text-foreground/80 text-justify">
                {insights.targetAudience}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
} 