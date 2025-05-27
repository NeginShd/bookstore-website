'use client';

/**
 * Header Component - Typography Hierarchy & Visual Design
 * 
 * Typography Scale Strategy:
 * - Desktop Primary Nav: text-base (16px) + font-semibold for maximum readability
 * - Logo: text-3xl (30px) + font-black + font-serif for brand prominence
 * - Secondary Nav: text-sm (14px) + font-medium for supporting information
 * - Mobile Logo: Responsive scaling (text-lg → text-2xl) based on screen size
 * 
 * Visual Hierarchy Principles:
 * 1. Logo as focal point: Largest, centered, distinctive serif font
 * 2. Primary navigation: High contrast, prominent sizing
 * 3. Secondary actions: Subdued coloring, smaller sizing
 * 4. Progressive disclosure: Information prioritized by importance
 * 
 * Accessibility Features:
 * - WCAG 2.1 AA compliant contrast ratios
 * - Semantic HTML with proper heading structure (h1 for logo)
 * - Screen reader optimized text ("کتابفروشی سبز" with hidden context)
 * - Focus management with visible rings and keyboard navigation
 * 
 * Animation Strategy:
 * - Micro-interactions: Subtle scale, tracking, and glow effects
 * - Duration: 300ms for smooth, professional feel
 * - Transform-based animations for GPU acceleration
 * - Hover states provide clear interactive feedback
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ChevronDown, Sun, Moon, Menu, Home as HomeIcon, BookOpen, Book, Star, Globe, User, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SearchBar from '@/components/books/SearchBar';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import GenreMegaMenu from '@/components/books/GenreMegaMenu';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import DynamicBreadcrumb from '@/components/navigation/DynamicBreadcrumb';

const genres = [
  { name: 'داستانی', slug: 'Fiction' },
  { name: 'غیرداستانی', slug: 'Non-Fiction' },
  { name: 'کلاسیک', slug: 'Classic' },
  { name: 'ویران‌شهری', slug: 'Dystopian' },
  { name: 'خودسازی', slug: 'Self-Help' },
  { name: 'فانتزی', slug: 'Fantasy' },
];

const genreGroups = [
  {
    title: 'داستانی',
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    genres: [
      { name: 'فانتزی', slug: 'Fantasy' },
      { name: 'کلاسیک', slug: 'Classic' },
      { name: 'ویران‌شهری', slug: 'Dystopian' },
    ],
  },
  {
    title: 'غیرداستانی',
    icon: <Globe className="h-5 w-5 text-primary" />,
    genres: [
      { name: 'خودسازی', slug: 'Self-Help' },
      { name: 'علمی', slug: 'Science' },
    ],
  },
  {
    title: 'محبوب',
    icon: <Star className="h-5 w-5 text-yellow-400" />,
    genres: [
      { name: 'پرفروش', slug: 'Bestseller' },
      { name: 'جدید', slug: 'New' },
    ],
  },
];

export default function Header() {
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUser();
  
  // Refs for performance optimization
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isScrolledCache = useRef(false);

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const newIsScrolled = scrollY > 10;
        
        // Only update state if changed to prevent unnecessary re-renders
        if (newIsScrolled !== isScrolledCache.current) {
          setIsScrolled(newIsScrolled);
          isScrolledCache.current = newIsScrolled;
        }
        
        // Update progress bar with optimized calculation
        if (Math.abs(scrollY - lastScrollY.current) > 5) { // Only update if significant scroll change
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const percent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
          
          setScrollProgress(percent);
          lastScrollY.current = scrollY;
        }
        
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Performance optimized scroll effect
  useEffect(() => {
    setHasMounted(true);

    // Passive event listener for better performance
    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', handleScroll, options);
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Cancel any pending animation frame
      if (ticking.current) {
        ticking.current = false;
      }
    };
  }, [handleScroll]);

  // Update progress bar using CSS variables for better performance
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.setProperty('--progress-width', `${scrollProgress}%`);
      progressRef.current.style.setProperty('--progress-opacity', scrollProgress > 0 ? '1' : '0');
    }
  }, [scrollProgress]);

  // Optimized keyboard handler with early return
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown, { passive: true });
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileMenuOpen, handleKeyDown]);

  // Memoize expensive calculations
  const itemCount = hasMounted ? getItemCount() : 0;
  const hasItems = itemCount > 0;
  const formattedItemCount = useMemo(() => {
    if (!hasItems) return '';
    return itemCount > 99 ? '99+' : itemCount.toLocaleString('fa-IR');
  }, [itemCount, hasItems]);

  // Optimized handlers
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleMobileLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
  }, [logout]);

  return (
    <>
      {/* Skip Navigation Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:border-2 focus:border-white"
        tabIndex={1}
      >
        پرش به محتوای اصلی
      </a>
      
      <header 
        className={
          `sticky top-0 z-50 transition-all duration-300 border-b border-green-900/40` +
          ` bg-[#022d2bcc] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(2,45,43,0.25)]`
        }
        role="banner"
        aria-label="ناوبری اصلی سایت"
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 z-0 bg-black/60 dark:bg-black/70 pointer-events-none" />
        {/* Scroll progress bar */}
        <div 
          ref={progressRef} 
          className="fixed top-0 right-0 left-0 h-1.5 z-[60] bg-gradient-to-l from-green-400 via-green-600 to-[#022d2b] rounded-b-full shadow-green-400/30 shadow-lg transition-opacity duration-200 will-change-[width] transform-gpu"
          style={{
            '--progress-width': '0%',
            '--progress-opacity': scrollProgress > 0 ? 1 : 0,
            width: 'var(--progress-width)',
            opacity: 'var(--progress-opacity)'
          } as React.CSSProperties}
          role="progressbar"
          aria-label="پیشرفت اسکرول صفحه"
        />
      
      <div className={`relative z-10 container mx-auto px-4 transition-[padding] duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}>
        {/* Desktop Layout (Large screens) */}
        <div className="hidden xl:grid grid-cols-3 items-center w-full gap-8">
          {/* Left: Desktop Navigation */}
          <nav 
            className="flex items-center gap-6 justify-start" 
            role="navigation" 
            aria-label="ناوبری اصلی"
          >
            <Link 
              href="/" 
              className={`text-white hover:text-green-200 transition-all duration-300 font-semibold text-base px-4 py-2.5 rounded-lg hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900 tracking-wide hover:tracking-wider hover:scale-105 hover:shadow-lg hover:shadow-green-400/20 transform ${typeof window !== 'undefined' && window.location.pathname === '/' ? 'bg-green-900/30 text-green-100 shadow-md shadow-green-400/25' : ''}`}
              aria-current={typeof window !== 'undefined' && window.location.pathname === '/' ? 'page' : undefined}
            >
              خانه
            </Link>
            
            {/* Categories Mega Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-green-200 hover:bg-green-900/30 transition-all duration-300 font-semibold text-base px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900 tracking-wide hover:tracking-wider hover:scale-105 hover:shadow-lg hover:shadow-green-400/20 transform"
                  aria-expanded={false}
                  aria-haspopup="menu"
                  aria-label="باز کردن منوی دسته‌بندی کتاب‌ها"
                >
                  دسته‌بندی‌ها
                  <ChevronDown className="mr-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[800px] max-h-[70vh] overflow-y-auto p-0" 
                align="start"
                role="menu"
                aria-label="دسته‌بندی کتاب‌ها"
              >
                <div className="p-4">
                  <GenreMegaMenu onItemClick={() => {}} />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
                          <Link 
                href="/books" 
                className="text-white hover:text-green-200 transition-all duration-300 font-semibold text-base px-4 py-2.5 rounded-lg hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900 tracking-wide hover:tracking-wider hover:scale-105 hover:shadow-lg hover:shadow-green-400/20 transform"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/books' ? 'page' : undefined}
              >
                کتاب‌ها
              </Link>
          </nav>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900 rounded-lg px-2 py-1 transition-all duration-300 hover:bg-green-900/10"
              aria-label="صفحه اصلی کتابفروشی سبز"
              title="بازگشت به صفحه اصلی"
            >
              <span className="inline-block transition-all duration-300 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 drop-shadow-xl flex-shrink-0">
                <Image 
                  src="/logo.jpg" 
                  alt="لوگوی کتابفروشی سبز" 
                  width={48} 
                  height={48} 
                  className="shadow-lg object-cover transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-green-400/30" 
                  priority 
                />
              </span>
              <h1 
                className="text-3xl font-black text-white tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:text-green-200 group-focus:text-green-200 group-hover:tracking-wider select-none font-serif leading-none"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                <span className="sr-only">کتابفروشی </span>سبز
              </h1>
            </Link>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-4 justify-end" role="toolbar" aria-label="ابزارهای کاربری">
            <nav className="flex items-center gap-4" role="navigation" aria-label="ناوبری ثانویه">
              <Link 
                href="/bestsellers" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-green-900/30 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900 tracking-wide backdrop-blur-sm hover:tracking-wider hover:scale-105 transform"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/bestsellers' ? 'page' : undefined}
              >
                پرفروش‌ها
              </Link>
              <Link 
                href="/contact" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-green-900/30 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900 tracking-wide backdrop-blur-sm hover:tracking-wider hover:scale-105 transform"
                aria-current={typeof window !== 'undefined' && window.location.pathname === '/contact' ? 'page' : undefined}
              >
                تماس
              </Link>
            </nav>
            
            <div className="h-8 w-px bg-white/30 mx-3 rounded-full" role="separator" aria-orientation="vertical"></div>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-900/30 h-9 w-9 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900"
              aria-label={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تیره'}
              title={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تیره'}
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </Button>
            <Link href="/cart" passHref>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-white hover:bg-green-900/30 h-9 w-9 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900" 
                aria-label={hasItems ? `سبد خرید - ${formattedItemCount} کالا` : "سبد خرید - خالی"}
                aria-describedby={hasItems ? "cart-count" : undefined}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {hasMounted && hasItems && (
                  <span 
                    id="cart-count"
                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-white shadow-lg animate-pulse"
                    aria-label={`تعداد کالاها: ${formattedItemCount}`}
                  >
                    {formattedItemCount}
                  </span>
                )}
                <span className="sr-only">سبد خرید</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-green-900/30 h-9 w-9 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-900" 
                  aria-label={user ? `حساب کاربری ${user.username || user.email}` : "ورود به حساب کاربری"}
                  aria-haspopup="menu"
                  aria-expanded={false}
                >
                  {user ? (
                    <Avatar className="ring-1 ring-white/20 h-7 w-7">
                      <AvatarFallback className="bg-green-800 text-white font-bold text-xs">
                        {user.username?.[0] || user.email?.[0] || 'ک'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">حساب کاربری</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56"
                role="menu"
                aria-label="منوی حساب کاربری"
              >
                {user ? (
                  <>
                    <DropdownMenuItem disabled className="text-sm text-muted-foreground font-medium border-b pb-2 mb-2">
                      {user.username || user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        حساب من
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <X className="mr-2 h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        ورود
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register"> 
                        <User className="mr-2 h-4 w-4" />
                          ثبت نام
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/staff/login">
                        <Globe className="mr-2 h-4 w-4" />
                        ورود کارکنان
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tablet Layout (Large to Medium screens) */}
        <div className="hidden lg:flex xl:hidden items-center justify-between w-full">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <span className="inline-block transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 drop-shadow-xl flex-shrink-0">
                <Image src="/logo.jpg" alt="لوگو" width={44} height={44} className="shadow-lg object-cover" priority />
              </span>
              <span className="text-2xl font-black text-white tracking-wide drop-shadow-2xl transition-colors group-hover:text-green-200 group-focus:text-green-200 select-none font-serif leading-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>سبز</span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-white hover:text-green-200 transition-colors duration-200 font-semibold px-3 py-2 rounded-lg hover:bg-green-900/20 text-sm tracking-wide">
              خانه
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-green-200 hover:bg-green-900/30 transition-all duration-200 font-semibold px-3 py-2 text-sm tracking-wide">
                  دسته‌ها
                  <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[700px] max-h-[60vh] overflow-y-auto p-0" align="center">
                <div className="p-3">
                  <GenreMegaMenu onItemClick={() => {}} />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/books" className="text-white hover:text-green-200 transition-colors duration-200 font-semibold px-3 py-2 rounded-lg hover:bg-green-900/20 text-sm tracking-wide">
              کتاب‌ها
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-900/30 h-8 w-8 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تیره'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-green-900/30 h-8 w-8 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105" aria-label="سبد خرید">
                <ShoppingCart className="h-4 w-4" />
                {hasMounted && hasItems && (
                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-lg animate-pulse text-[10px]">
                    {formattedItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-900/30 h-8 w-8 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105" aria-label="حساب کاربری">
                  {user ? (
                    <Avatar className="ring-1 ring-white/20 h-6 w-6">
                      <AvatarFallback className="bg-green-800 text-white font-bold text-xs">
                        {user.username?.[0] || user.email?.[0] || 'ک'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem disabled className="text-sm text-muted-foreground font-medium border-b pb-2 mb-2">
                      {user.username || user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        حساب من
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <X className="mr-2 h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        ورود
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register"> 
                        <User className="mr-2 h-4 w-4" />
                          ثبت نام
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/staff/login">
                        <Globe className="mr-2 h-4 w-4" />
                        ورود کارکنان
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Small Mobile Layout (Below 640px) */}
        <div className="flex sm:hidden items-center justify-between w-full">
          {/* Left: Menu */}
          <div className="flex items-center justify-start">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-green-900/30 h-10 w-10 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="منو"
                >
                  <Menu className="h-5 w-5 transition-transform duration-200" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="fixed inset-y-0 right-0 z-50 w-[90vw] max-w-xs bg-background/98 backdrop-blur-xl flex flex-col p-0 border-l border-border/50 shadow-2xl"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <SheetHeader className="p-4 border-b border-border/50 bg-muted/30 shrink-0">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold text-primary tracking-wide">منو</SheetTitle>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-muted rounded-full transition-all duration-200"
                        aria-label="بستن"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4">
                  <GenreMegaMenu onItemClick={closeMobileMenu} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Compact Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center gap-2 group focus:outline-none">
              <span className="inline-block transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 drop-shadow-xl flex-shrink-0">
                <Image src="/logo.jpg" alt="لوگو" width={36} height={36} className="shadow-lg object-cover" priority />
              </span>
              <span className="text-lg font-black text-white tracking-wide drop-shadow-2xl transition-colors group-hover:text-green-200 group-focus:text-green-200 select-none font-serif leading-none" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>سبز</span>
            </Link>
          </div>

          {/* Right: Essential Actions */}
          <div className="flex items-center gap-1 justify-end">
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-green-900/30 h-10 w-10 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105" aria-label="سبد خرید">
                <ShoppingCart className="h-5 w-5" />
                {hasMounted && hasItems && (
                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-white shadow-lg animate-pulse text-[10px]">
                    {formattedItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-900/30 h-10 w-10 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105" aria-label="حساب کاربری">
                  {user ? (
                    <Avatar className="ring-1 ring-white/20 h-7 w-7">
                      <AvatarFallback className="bg-green-800 text-white font-bold text-xs">
                        {user.username?.[0] || user.email?.[0] || 'ک'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem disabled className="text-sm text-muted-foreground font-medium border-b pb-2 mb-2">
                      {user.username || user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        حساب من
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <X className="mr-2 h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        ورود
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register"> 
                        <User className="mr-2 h-4 w-4" />
                          ثبت نام
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/staff/login">
                        <Globe className="mr-2 h-4 w-4" />
                        ورود کارکنان
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Regular Mobile Layout (640px to 1024px) */}
        <div className="hidden sm:flex lg:hidden items-center justify-between w-full">
          {/* Left: Menu */}
          <div className="flex items-center gap-2 justify-start">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-green-900/30 h-11 w-11 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105"
                  aria-label="دسته‌بندی کتاب‌ها"
                >
                  <Menu className="h-6 w-6 transition-transform duration-200" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm bg-background/98 backdrop-blur-xl flex flex-col p-0 border-l border-border/50 shadow-2xl"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <SheetHeader className="p-5 border-b border-border/50 bg-muted/30 shrink-0">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-2xl font-bold text-primary tracking-wide">دسته‌بندی کتاب‌ها</SheetTitle>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 hover:bg-muted rounded-full transition-all duration-200"
                        aria-label="بستن منو"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-5">
                  <GenreMegaMenu onItemClick={closeMobileMenu} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center gap-4 group focus:outline-none">
              <span className="inline-block transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 drop-shadow-xl flex-shrink-0">
                <Image src="/logo.jpg" alt="لوگو" width={52} height={52} className="shadow-lg object-cover" priority />
              </span>
              <span className="text-2xl font-black text-white tracking-wide drop-shadow-2xl transition-colors group-hover:text-green-200 group-focus:text-green-200 select-none font-serif leading-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>سبز</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-900/30 h-11 w-11 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تیره'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-green-900/30 h-11 w-11 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105" aria-label="سبد خرید">
                <ShoppingCart className="h-5 w-5" />
                {hasMounted && hasItems && (
                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border border-white shadow-lg animate-pulse">
                    {formattedItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-900/30 h-11 w-11 shadow-green-400/20 shadow-lg transition-all duration-200 hover:scale-105" aria-label="حساب کاربری">
                  {user ? (
                    <Avatar className="ring-1 ring-white/20 h-8 w-8">
                      <AvatarFallback className="bg-green-800 text-white font-bold text-sm">
                        {user.username?.[0] || user.email?.[0] || 'ک'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {user ? (
                  <>
                    <DropdownMenuItem disabled className="text-sm text-muted-foreground font-medium border-b pb-2 mb-2">
                      {user.username || user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        حساب من
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <X className="mr-2 h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        ورود
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register"> 
                        <User className="mr-2 h-4 w-4" />
                          ثبت نام
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/staff/login">
                        <Globe className="mr-2 h-4 w-4" />
                        ورود کارکنان
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
    
    {/* Dynamic Breadcrumb */}
    <DynamicBreadcrumb className="sticky top-[72px] z-40" />
    </>
  );
}
