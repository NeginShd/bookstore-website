
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { ShoppingCart, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const total = getCartTotal();
  const itemCount = getItemCount();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemCount === 0) {
      toast({
        title: "خطا در ثبت سفارش",
        description: "سبد خرید شما خالی است. لطفاً ابتدا کتابی به سبد خرید خود اضافه کنید.",
        variant: "destructive",
      });
      return;
    }
    // Mock order submission
    console.log('Order submitted:', { formData, cartItems, total });
    
    clearCart();
    toast({
      title: "سفارش شما ثبت شد!",
      description: "از خرید شما متشکریم. سفارش شما با موفقیت پردازش شد.",
      variant: "default", // "success" variant might be better if defined, or use default
    });
    router.push('/'); 
  };

  // This check ensures that we don't try to redirect or show empty cart message before client has loaded cart state
  if (!isClient) {
    return (
       <div className="flex flex-col items-center justify-center text-center py-20 min-h-[calc(100vh-20rem)]">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-6 animate-pulse" />
        <p className="text-lg text-muted-foreground">در حال بارگذاری اطلاعات تسویه حساب...</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 min-h-[calc(100vh-20rem)]">
        <AlertCircle className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-4">سبد خرید شما خالی است</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          برای ادامه به صفحه تسویه حساب، ابتدا باید کتابی به سبد خرید خود اضافه کنید.
        </p>
        <Link href="/" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            بازگشت به فروشگاه
          </Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">تسویه حساب</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>اطلاعات ارسال</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input id="name" type="text" value={formData.name} onChange={handleInputChange} required className="bg-background/80 focus:bg-background" />
              </div>
              <div>
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-background/80 focus:bg-background" />
              </div>
              <div>
                <Label htmlFor="address">آدرس</Label>
                <Input id="address" type="text" value={formData.address} onChange={handleInputChange} required className="bg-background/80 focus:bg-background" />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={itemCount === 0}
              >
                ثبت سفارش
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>خلاصه سفارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                <div>
                  <p className="font-medium text-foreground">{item.title} (x{item.quantity.toLocaleString('fa-IR')})</p>
                  <p className="text-xs text-muted-foreground">{item.author}</p>
                </div>
                <p className="text-foreground">
                  {(item.price * item.quantity).toLocaleString('fa-IR', { style: 'currency', currency: 'IRR' }).replace('IRR', 'ریال')}
                </p>
              </div>
            ))}
             {itemCount === 0 && <p className="text-muted-foreground">سبد خرید شما خالی است.</p>}
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <div className="flex justify-between w-full text-xl font-bold text-primary">
              <span>جمع کل:</span>
              <span>{total.toLocaleString('fa-IR', { style: 'currency', currency: 'IRR' }).replace('IRR', 'ریال')}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
