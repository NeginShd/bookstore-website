'use client';

import { useCart } from '@/contexts/CartContext';
import type { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  book: Book;
}

export default function AddToCartButton({ book }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    addToCart(book);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 700);
  };

  return (
    <Button onClick={handleClick} className="w-full" variant={success ? 'success' : 'default'}>
      <ShoppingCart className="ms-2 h-4 w-4" />
      افزودن به سبد
    </Button>
  );
}
