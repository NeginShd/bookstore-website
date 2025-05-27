"use client";

import AddToCartButton from "@/components/books/AddToCartButton";
import BookInsightsClient from "@/components/books/BookInsightsClient";
import type { Book } from "@/lib/types";

export function BookActions({ book }: { book: Book }) {
  return (
    <>
      <AddToCartButton book={book} />
      <BookInsightsClient book={book} />
    </>
  );
} 