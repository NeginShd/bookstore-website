'use client';

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-24 h-36 sm:w-20 sm:h-28 flex-shrink-0">
          <Image
            src={item.coverImage}
            alt={`Cover of ${item.title}`}
            fill={true} // Changed layout to fill
            style={{ objectFit: 'contain' }} // Ensures image fits without cropping
            data-ai-hint={item.dataAiHint || "book cover"}
          />
        </div>
        <div className="flex-grow text-center sm:text-start">
          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.author}</p>
          <p className="text-md font-semibold text-primary mt-1">
            {Math.floor(item.price).toLocaleString('fa-IR')} تومان
          </p>
        </div>
        <div className="flex items-center gap-2 rtl:gap-x-reverse mt-2 sm:mt-0">
          <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
            className="w-16 text-center"
            min="1"
          />
          <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 sm:mt-0">
          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">حذف آیتم</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
