'use client';

import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// مپ برای ترجمه مسیرها به فارسی
const pathTranslations: Record<string, string> = {
  'books': 'کتاب‌ها',
  'categories': 'دسته‌بندی‌ها',
  'bestsellers': 'پرفروش‌ها',
  'new': 'جدیدترین‌ها',
  'contact': 'تماس با ما',
  'about': 'درباره ما',
  'cart': 'سبد خرید',
  'checkout': 'پرداخت',
  'account': 'حساب کاربری',
  'profile': 'پروفایل',
  'orders': 'سفارش‌ها',
  'wishlist': 'علاقه‌مندی‌ها',
  'search': 'جستجو',
  'author': 'نویسنده',
  'publisher': 'ناشر',
  'genre': 'ژانر',
  'login': 'ورود',
  'register': 'ثبت نام',
  'staff': 'کارکنان',
  'admin': 'مدیریت',
  'fiction': 'داستانی',
  'non-fiction': 'غیرداستانی',
  'classic': 'کلاسیک',
  'dystopian': 'ویران‌شهری',
  'self-help': 'خودسازی',
  'fantasy': 'فانتزی',
  'science': 'علمی',
  'bestseller': 'پرفروش',
};

// صفحاتی که نباید breadcrumb نشان داده شود
const excludedPaths = ['/', '/login', '/register'];

interface BreadcrumbItemData {
  href: string;
  label: string;
  isHome?: boolean;
  isLast?: boolean;
  isEllipsis?: boolean;
}

interface DynamicBreadcrumbProps {
  className?: string;
  maxItems?: number;
  customSegments?: Record<string, string>;
}

export default function DynamicBreadcrumb({ 
  className = "", 
  maxItems = 5,
  customSegments = {}
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // اگر در صفحات مستثنی هستیم، چیزی نمایش نده
  if (excludedPaths.includes(pathname)) {
    return null;
  }

  // تجزیه مسیر URL
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // اگر فقط در صفحه اصلی هستیم
  if (pathSegments.length === 0) {
    return null;
  }

  // ایجاد breadcrumb items
  const breadcrumbItems: BreadcrumbItemData[] = [];
  
  // همیشه خانه را اضافه کن
  breadcrumbItems.push({
    href: '/',
    label: 'خانه',
    isHome: true,
  });

  // ایجاد مسیر برای هر segment
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // ترجمه segment
    const translatedSegment = customSegments[segment] || 
                             pathTranslations[segment.toLowerCase()] || 
                             decodeURIComponent(segment);
    
    breadcrumbItems.push({
      href: currentPath,
      label: translatedSegment,
      isLast: index === pathSegments.length - 1,
    });
  });

  // محدود کردن تعداد آیتم‌ها
  let displayItems = breadcrumbItems;
  if (breadcrumbItems.length > maxItems) {
    const firstItem = breadcrumbItems[0];
    const lastItems = breadcrumbItems.slice(-2);
    displayItems = [firstItem, { href: '#', label: '...', isEllipsis: true }, ...lastItems];
  }

  return (
    <div className={`bg-muted/30 border-b border-border/50 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {displayItems.map((item, index) => (
              <div key={item.href} className="contents">
                <BreadcrumbItem>
                  {item.isEllipsis ? (
                    <span className="text-muted-foreground px-1">...</span>
                  ) : item.isLast ? (
                    <BreadcrumbPage className="font-semibold text-sm tracking-wide">
                      {item.isHome && <Home className="h-4 w-4 ml-1" aria-hidden="true" />}
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href} className="flex items-center font-medium text-sm tracking-wide transition-all duration-200 hover:text-primary hover:scale-105">
                      {item.isHome && <Home className="h-4 w-4 ml-1" aria-hidden="true" />}
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                
                {/* جداکننده را فقط اگر آخرین آیتم نباشد نمایش بده */}
                {index < displayItems.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
} 