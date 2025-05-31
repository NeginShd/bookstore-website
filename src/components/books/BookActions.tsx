"use client";

import AddToCartButton from "@/components/books/AddToCartButton";
import BookInsightsClient from "@/components/books/BookInsightsClient";
import type { Book } from "@/lib/types";

export interface BookActionsProps {
  book: Book;
  disabled?: boolean;
}

export function BookActions({ book, disabled = false }: BookActionsProps) {
  return (
    <>
      <AddToCartButton book={book} disabled={disabled} />
      <BookInsightsClient book={book} />
    </>
  );
} 