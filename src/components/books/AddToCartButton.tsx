'use client';

import { useCart } from '@/contexts/CartContext';
import type { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  book: Book;
  disabled?: boolean;
}

export default function AddToCartButton({ book, disabled = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    addToCart(book);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 700);
  };

  return (
    <Button 
      onClick={handleClick} 
      className="w-full" 
      variant={success ? 'success' : 'default'}
      disabled={disabled}
    >
      <ShoppingCart className="ms-2 h-4 w-4" />
      {disabled ? 'ناموجود' : 'افزودن به سبد'}
    </Button>
  );
}
