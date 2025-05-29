'use client';

import Link from 'next/link';
import { BookOpen, Star, Layers, Book, Globe, ChevronRight, ChevronDown, Heart, GraduationCap, Briefcase, Baby, Users, Brain, Zap, TrendingUp, Award, Coffee, Music, Camera, Palette, Hammer, Stethoscope, Scale, Leaf, Mountain, Home as HomeIcon, Rocket } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

// نوع داده برای دسته‌بندی‌ها
interface Genre {
  name: string;
  slug: string;
  icon?: string;
}

interface CategoryGroup {
  title: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  genres: Genre[];
}

// دسته‌بندی جامع کتاب‌ها (ساده‌شده برای نمایش بهتر)
const comprehensiveCategories: CategoryGroup[] = [
  {
    title: 'ادبیات و داستان',
    icon: <BookOpen className="h-6 w-6 text-blue-400" />,
    color: 'blue',
    description: 'آثار ادبی، رمان و داستان‌های مختلف',
    genres: [
      { name: 'ادبیات کلاسیک جهان', slug: 'classic-world-literature', icon: '' },
      { name: 'ادبیات کلاسیک ایران', slug: 'classic-iranian-literature', icon: '' },
      { name: 'رمان معاصر', slug: 'contemporary-fiction', icon: '' },
      { name: 'داستان کوتاه', slug: 'short-stories', icon: '' },
      { name: 'علمی تخیلی', slug: 'science-fiction', icon: '' },
      { name: 'فانتزی', slug: 'fantasy', icon: '' },
      { name: 'رمانتیک', slug: 'romance', icon: '' },
      { name: 'تریلر', slug: 'thriller', icon: '' },
      { name: 'جنایی و پلیسی', slug: 'crime-mystery', icon: '' },
      { name: 'ماجراجویی', slug: 'adventure', icon: '' },
      { name: 'عاشقانه', slug: 'romance', icon: '' },
      { name: 'شاهکارهای جهان', slug: 'world-masterpieces', icon: '' }
    ]
  },
  {
    title: 'علوم و فناوری',
    icon: <Rocket className="h-6 w-6 text-cyan-400" />,
    color: 'cyan',
    description: 'دانش علمی و فناوری‌های نوین',
    genres: [
      { name: 'ریاضیات', slug: 'mathematics', icon: '' },
      { name: 'فیزیک', slug: 'physics', icon: '' },
      { name: 'شیمی', slug: 'chemistry', icon: '' },
      { name: 'زیست‌شناسی', slug: 'biology', icon: '' },
      { name: 'زمین‌شناسی', slug: 'geology', icon: '' },
      { name: 'نجوم', slug: 'astronomy', icon: '' },
      { name: 'برنامه‌نویسی', slug: 'programming', icon: '' },
      { name: 'هوش مصنوعی', slug: 'artificial-intelligence', icon: '' },
      { name: 'امنیت سایبری', slug: 'cybersecurity', icon: '' },
      { name: 'طراحی وب', slug: 'web-design', icon: '' },
      { name: 'داده‌کاوی', slug: 'data-science', icon: '' },
      { name: 'مهندسی', slug: 'engineering', icon: '' }
    ]
  },
  {
    title: 'علوم انسانی',
    icon: <Users className="h-6 w-6 text-rose-400" />,
    color: 'rose',
    description: 'علوم اجتماعی و انسانی',
    genres: [
      { name: 'تاریخ ایران', slug: 'iranian-history', icon: '' },
      { name: 'تاریخ جهان', slug: 'world-history', icon: '' },
      { name: 'تاریخ اسلام', slug: 'islamic-history', icon: '' },
      { name: 'فلسفه غرب', slug: 'western-philosophy', icon: '' },
      { name: 'فلسفه اسلامی', slug: 'islamic-philosophy', icon: '' },
      { name: 'فلسفه شرق', slug: 'eastern-philosophy', icon: '' },
      { name: 'روان‌شناسی', slug: 'psychology', icon: '' },
      { name: 'جامعه‌شناسی', slug: 'sociology', icon: '' },
      { name: 'انسان‌شناسی', slug: 'anthropology', icon: '' },
      { name: 'منطق', slug: 'logic', icon: '' },
      { name: 'اخلاق', slug: 'ethics', icon: '' }
    ]
  },
  {
    title: 'خودسازی و موفقیت',
    icon: <TrendingUp className="h-6 w-6 text-green-400" />,
    color: 'green',
    description: 'رشد شخصی و مهارت‌های زندگی',
    genres: [
      { name: 'خودشناسی', slug: 'self-awareness', icon: '' },
      { name: 'اعتماد به نفس', slug: 'self-confidence', icon: '' },
      { name: 'مدیریت زمان', slug: 'time-management', icon: '' },
      { name: 'هدف‌گذاری', slug: 'goal-setting', icon: '' },
      { name: 'مهارت‌های اجتماعی', slug: 'social-skills', icon: '' },
      { name: 'فن بیان', slug: 'public-speaking', icon: '' },
      { name: 'مذاکره', slug: 'negotiation', icon: '' },
      { name: 'رهبری', slug: 'leadership', icon: '' },
      { name: 'کارآفرینی', slug: 'entrepreneurship', icon: '' },
      { name: 'مدیریت', slug: 'management', icon: '' },
      { name: 'بازاریابی', slug: 'marketing', icon: '' },
      { name: 'سرمایه‌گذاری', slug: 'investment', icon: '' }
    ]
  },
  {
    title: 'هنر و خلاقیت',
    icon: <Palette className="h-6 w-6 text-purple-400" />,
    color: 'purple',
    description: 'هنرهای تجسمی، موسیقی و خلاقیت',
    genres: [
      { name: 'نقاشی', slug: 'painting', icon: '' },
      { name: 'عکاسی', slug: 'photography', icon: '' },
      { name: 'مجسمه‌سازی', slug: 'sculpture', icon: '' },
      { name: 'طراحی گرافیک', slug: 'graphic-design', icon: '' },
      { name: 'تئوری موسیقی', slug: 'music-theory', icon: '' },
      { name: 'آموزش سازها', slug: 'instruments', icon: '' },
      { name: 'تئاتر', slug: 'theater', icon: '' },
      { name: 'سینما', slug: 'cinema', icon: '' },
      { name: 'خلاقیت', slug: 'creativity', icon: '' },
      { name: 'طراحی', slug: 'design', icon: '' }
    ]
  },
  {
    title: 'سلامت و پزشکی',
    icon: <Stethoscope className="h-6 w-6 text-red-400" />,
    color: 'red',
    description: 'علوم پزشکی و سلامت',
    genres: [
      { name: 'آناتومی', slug: 'anatomy', icon: '' },
      { name: 'فیزیولوژی', slug: 'physiology', icon: '' },
      { name: 'پاتولوژی', slug: 'pathology', icon: '' },
      { name: 'داروشناسی', slug: 'pharmacology', icon: '' },
      { name: 'تغذیه سالم', slug: 'healthy-nutrition', icon: '' },
      { name: 'ورزش و تناسب اندام', slug: 'fitness', icon: '' },
      { name: 'یوگا و مدیتیشن', slug: 'yoga-meditation', icon: '' },
      { name: 'رژیم درمانی', slug: 'diet-therapy', icon: '' },
      { name: 'طب سنتی', slug: 'traditional-medicine', icon: '' }
    ]
  },
  {
    title: 'دین و معنویت',
    icon: <Heart className="h-6 w-6 text-amber-400" />,
    color: 'amber',
    description: 'متون دینی و معنوی',
    genres: [
      { name: 'قرآن و تفسیر', slug: 'quran-tafsir', icon: '' },
      { name: 'احادیث', slug: 'hadith', icon: '' },
      { name: 'فقه', slug: 'jurisprudence', icon: '' },
      { name: 'اخلاق اسلامی', slug: 'islamic-ethics', icon: '' },
      { name: 'عرفان', slug: 'mysticism', icon: '' },
      { name: 'ادیان جهان', slug: 'world-religions', icon: '' },
      { name: 'معنویت', slug: 'spirituality', icon: '' },
      { name: 'دعا و ذکر', slug: 'prayer-dhikr', icon: '' }
    ]
  },
  {
    title: 'کودک و نوجوان',
    icon: <Baby className="h-6 w-6 text-cyan-400" />,
    color: 'cyan',
    description: 'کتاب‌های مخصوص کودکان و نوجوانان',
    genres: [
      { name: 'قصه‌های کودکانه', slug: 'children-stories', icon: '' },
      { name: 'شعر کودک', slug: 'children-poetry', icon: '' },
      { name: 'آموزش حروف و اعداد', slug: 'letters-numbers', icon: '' },
      { name: 'رنگ‌آمیزی', slug: 'coloring-books', icon: '' },
      { name: 'ماجراجویی نوجوانان', slug: 'teen-adventure', icon: '' },
      { name: 'علمی تخیلی نوجوانان', slug: 'teen-scifi', icon: '' },
      { name: 'رمان‌های نوجوانان', slug: 'teen-fiction', icon: '' },
      { name: 'آموزش مهارت‌های زندگی', slug: 'life-skills-teens', icon: '' },
      { name: 'کتاب‌های تصویری', slug: 'picture-books', icon: '' }
    ]
  },
  {
    title: 'حقوق و قانون',
    icon: <Scale className="h-6 w-6 text-slate-400" />,
    color: 'slate',
    description: 'علوم حقوقی و قانون',
    genres: [
      { name: 'حقوق مدنی', slug: 'civil-law', icon: '' },
      { name: 'حقوق جزا', slug: 'criminal-law', icon: '' },
      { name: 'حقوق تجارت', slug: 'commercial-law', icon: '' },
      { name: 'حقوق بین‌الملل', slug: 'international-law', icon: '' },
      { name: 'حقوق خانواده', slug: 'family-law', icon: '' },
      { name: 'حقوق اداری', slug: 'administrative-law', icon: '' },
      { name: 'حقوق قانون اساسی', slug: 'constitutional-law', icon: '' }
    ]
  },
  {
    title: 'سبک زندگی',
    icon: <Coffee className="h-6 w-6 text-orange-400" />,
    color: 'orange',
    description: 'خانه‌داری، آشپزی و سبک زندگی',
    genres: [
      { name: 'آشپزی', slug: 'cooking', icon: '' },
      { name: 'شیرینی‌پزی', slug: 'baking', icon: '' },
      { name: 'دکوراسیون منزل', slug: 'home-decoration', icon: '' },
      { name: 'باغبانی', slug: 'gardening', icon: '' },
      { name: 'مد و پوشاک', slug: 'fashion', icon: '' },
      { name: 'سفر', slug: 'travel', icon: '' },
      { name: 'عکاسی سفر', slug: 'travel-photography', icon: '' },
      { name: 'سبک زندگی سالم', slug: 'healthy-lifestyle', icon: '' }
    ]
  }
];

// ژانرهای محبوب بدون emoji
const trendingGenres = [
  { name: 'رمان‌های پرفروش', slug: 'bestseller-novels', icon: '' },
  { name: 'کتاب‌های جدید', slug: 'new-releases', icon: '' },
  { name: 'خودسازی', slug: 'self-improvement', icon: '' },
  { name: 'علمی تخیلی', slug: 'science-fiction', icon: '' },
  { name: 'آشپزی', slug: 'cooking', icon: '' },
  { name: 'کودک', slug: 'children', icon: '' },
];

interface GenreMegaMenuProps {
  onItemClick?: () => void;
}

export default function GenreMegaMenu({ onItemClick }: GenreMegaMenuProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCategories = showAll ? comprehensiveCategories : comprehensiveCategories.slice(0, 4);

  const handleGenreClick = () => {
    onItemClick?.();
  };

  const toggleCategory = (categoryTitle: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryTitle)) {
      newExpanded.delete(categoryTitle);
    } else {
      newExpanded.add(categoryTitle);
    }
    setExpandedCategories(newExpanded);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'border' | 'text' | 'hover' | 'accent') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        bg: 'bg-blue-900/30',
        border: 'border-blue-700/50',
        text: 'text-blue-100',
        hover: 'hover:bg-blue-700/50',
        accent: 'bg-blue-500/20'
      },
      green: {
        bg: 'bg-green-900/30',
        border: 'border-green-700/50',
        text: 'text-green-100',
        hover: 'hover:bg-green-700/50',
        accent: 'bg-green-500/20'
      },
      purple: {
        bg: 'bg-purple-900/30',
        border: 'border-purple-700/50',
        text: 'text-purple-100',
        hover: 'hover:bg-purple-700/50',
        accent: 'bg-purple-500/20'
      },
      rose: {
        bg: 'bg-rose-900/30',
        border: 'border-rose-700/50',
        text: 'text-rose-100',
        hover: 'hover:bg-rose-700/50',
        accent: 'bg-rose-500/20'
      },
      cyan: {
        bg: 'bg-cyan-900/30',
        border: 'border-cyan-700/50',
        text: 'text-cyan-100',
        hover: 'hover:bg-cyan-700/50',
        accent: 'bg-cyan-500/20'
      },
      amber: {
        bg: 'bg-amber-900/30',
        border: 'border-amber-700/50',
        text: 'text-amber-100',
        hover: 'hover:bg-amber-700/50',
        accent: 'bg-amber-500/20'
      },
      red: {
        bg: 'bg-red-900/30',
        border: 'border-red-700/50',
        text: 'text-red-100',
        hover: 'hover:bg-red-700/50',
        accent: 'bg-red-500/20'
      },
      slate: {
        bg: 'bg-slate-900/30',
        border: 'border-slate-700/50',
        text: 'text-slate-100',
        hover: 'hover:bg-slate-700/50',
        accent: 'bg-slate-500/20'
      },
      orange: {
        bg: 'bg-orange-900/30',
        border: 'border-orange-700/50',
        text: 'text-orange-100',
        hover: 'hover:bg-orange-700/50',
        accent: 'bg-orange-500/20'
      }
    };
    return colorMap[color]?.[variant] || '';
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col space-y-6">
      {/* محبوب‌ترین ژانرها */}
      <div className="bg-gradient-to-br from-green-900/40 to-green-800/30 p-5 rounded-2xl shadow-xl border border-green-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-400/20 rounded-full">
          <Star className="h-5 w-5 text-yellow-400 drop-shadow" />
          </div>
          <h3 className="text-lg font-bold text-green-100 drop-shadow">محبوب‌ترین دسته‌ها</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trendingGenres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/genre/${genre.slug}`}
              onClick={handleGenreClick}
              className="group flex items-center gap-3 p-3 rounded-xl bg-green-700/50 text-green-100 text-sm font-medium hover:bg-green-600/70 hover:text-white transition-all duration-200 shadow-lg border border-green-600/80 hover:border-green-500/90 hover:shadow-green-400/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Book className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="flex-1 truncate">{genre.name}</span>
              <ChevronRight className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      {/* دسته‌بندی‌های اصلی */}
      <div className="space-y-4">
        {visibleCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.title);
          return (
            <div 
              key={category.title} 
              className={`${getColorClasses(category.color, 'bg')} rounded-2xl p-5 shadow-xl ${getColorClasses(category.color, 'border')} backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}
            >
                              <button
                  onClick={() => toggleCategory(category.title)}
                  className="flex items-center justify-between w-full mb-4 group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-2"
                  {...(isExpanded ? { 'aria-expanded': true } : { 'aria-expanded': false })}
                >
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${getColorClasses(category.color, 'accent')} rounded-xl group-hover:bg-background/30 transition-colors shadow-lg`}>
                    {category.icon}
                  </div>
                  <div className="text-right">
                    <h4 className={`font-bold text-xl ${getColorClasses(category.color, 'text')} drop-shadow`}>
                      {category.title}
                    </h4>
                    {category.description && (
                      <p className={`text-sm ${getColorClasses(category.color, 'text')} opacity-80 mt-1`}>
                        {category.description}
                      </p>
                    )}
                  </div>
            </div>
                <ChevronDown 
                  className={`h-5 w-5 ${getColorClasses(category.color, 'text')} transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {isExpanded && (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {category.genres.map((genre, index) => (
                  <Link
                        key={genre.slug}
                    href={`/genre/${genre.slug}`}
                        onClick={handleGenreClick}
                        className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${getColorClasses(category.color, 'text')} ${getColorClasses(category.color, 'hover')} hover:text-white border border-transparent hover:border-primary/30 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        style={{
                          animationDelay: `${index * 30}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background/20 rounded group-hover:bg-background/30 transition-colors">
                            {genre.icon ? (
                              <span className="text-base">{genre.icon}</span>
                            ) : (
                              <Book className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            )}
                          </div>
                          <span className="font-medium text-sm">{genre.name}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
              ))}
                  </div>
                </div>
              )}
          </div>
          );
        })}
      </div>

      {/* دکمه نمایش همه */}
      {!showAll && comprehensiveCategories.length > visibleCategories.length && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            className="px-6 py-3 rounded-xl bg-primary/10 border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-200 shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95"
          >
            <Layers className="ms-2 h-4 w-4" />
            نمایش همه دسته‌بندی‌ها ({comprehensiveCategories.length - visibleCategories.length} دسته دیگر)
          </Button>
        </div>
      )}
    </div>
  );
} 