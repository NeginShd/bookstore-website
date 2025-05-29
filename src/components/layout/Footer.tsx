import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [enamadLoaded, setEnamadLoaded] = useState(true);
  const [samanLoaded, setSamanLoaded] = useState(true);
  
  return (
    <footer className="relative bg-[#022d2bcc] backdrop-blur-xl border-t border-green-900/40 shadow-[0_-8px_32px_0_rgba(2,45,43,0.25)] mt-16 transition-all duration-300">
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/60 dark:bg-black/70 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-xl flex-shrink-0">
                <Image 
                  src="/logo.jpg" 
                  alt="لوگو کتابفروشی سبز" 
                  width={42} 
                  height={42} 
                  className="shadow-lg object-cover transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-green-400/30" 
                />
              </span>
              <span 
                className="text-2xl font-black text-white tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:text-green-200 group-hover:tracking-wider select-none font-serif leading-none"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                سبز
              </span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              کتابفروشی سبز، دریچه‌ای به دنیای کتاب و دانش. با بیش از هزاران عنوان کتاب در موضوعات مختلف، همراه شما در مسیر مطالعه و رشد فکری.
            </p>
            <div className="flex items-center gap-5 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="اینستاگرام" 
                className="text-green-300 hover:text-green-100 transition-all duration-300 hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="فیسبوک" 
                className="text-green-300 hover:text-green-100 transition-all duration-300 hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="توییتر" 
                className="text-green-300 hover:text-green-100 transition-all duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="یوتیوب" 
                className="text-green-300 hover:text-green-100 transition-all duration-300 hover:scale-110"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4 border-r-2 border-green-400 pr-3">دسترسی سریع</h3>
            <nav className="grid grid-cols-1 gap-2">
              <Link 
                href="/" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                صفحه اصلی
              </Link>
              <Link 
                href="/books" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                همه کتاب‌ها
              </Link>
              <Link 
                href="/bestsellers" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                پرفروش‌ها
              </Link>
              <Link 
                href="/categories" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                دسته‌بندی‌ها
              </Link>
              <Link 
                href="/genre/Fiction" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                ژانرها
              </Link>
            </nav>
          </div>
          
          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4 border-r-2 border-green-400 pr-3">خدمات مشتریان</h3>
            <nav className="grid grid-cols-1 gap-2">
              <Link 
                href="/contact" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                تماس با ما
              </Link>
              <Link 
                href="/faq" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                سوالات متداول
              </Link>
              <Link 
                href="/shipping" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                روش‌های ارسال
              </Link>
              <Link 
                href="/return-policy" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                شرایط بازگشت کالا
              </Link>
              <Link 
                href="/privacy" 
                className="text-green-100 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide hover:tracking-wider hover:translate-x-1 flex items-center"
              >
                <span className="bg-green-800/20 p-0.5 rounded-md ml-2">›</span>
                حریم خصوصی
              </Link>
            </nav>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4 border-r-2 border-green-400 pr-3">ارتباط با ما</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-green-300 flex-shrink-0 mt-1" size={18} />
                <span className="text-green-100 text-sm">تهران، خیابان انقلاب، چهارراه کالج، پلاک ۱۲۳</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-green-300 flex-shrink-0" size={18} />
                <a href="tel:+982112345678" className="text-green-100 hover:text-white text-sm transition-colors">۰۲۱-۱۲۳۴۵۶۷۸</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-green-300 flex-shrink-0" size={18} />
                <a href="mailto:info@sabz.com" className="text-green-100 hover:text-white text-sm transition-colors">info@sabz.com</a>
              </div>
            </div>
            
            {/* Newsletter (simple version) */}
            <div className="pt-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="footer-email" className="text-sm text-green-100">
                  عضویت در خبرنامه
                </label>
                <div className="flex">
                  <input 
                    type="email" 
                    id="footer-email"
                    placeholder="ایمیل خود را وارد کنید" 
                    className="bg-green-900/30 text-white p-2 text-sm rounded-r-md w-full focus:outline-none focus:ring-1 focus:ring-green-400 border border-green-900/60" 
                  />
                  <button 
                    className="bg-green-700 hover:bg-green-600 text-white p-2 rounded-l-md transition-colors"
                    aria-label="ثبت ایمیل در خبرنامه"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Separator */}
        <div className="h-px bg-green-900/40 w-full my-8"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-green-300 text-sm order-2 md:order-1">
            <p className="flex items-center gap-1 justify-center md:justify-start">
              &copy; {currentYear} کتابفروشی سبز. تمام حقوق محفوظ است.
              <span className="inline-flex items-center text-xs">
                ساخته شده با <Heart size={12} className="mx-1 text-red-400" /> در ایران
              </span>
            </p>
          </div>
          
          <div className="flex gap-6 order-1 md:order-2">
            {enamadLoaded && (
              <div className="bg-white p-1 rounded-md">
                <Image 
                  src="/images/enamad.png" 
                  alt="نماد اعتماد الکترونیکی" 
                  width={70} 
                  height={70} 
                  className="h-16 w-auto object-contain"
                  onError={() => setEnamadLoaded(false)}
                />
              </div>
            )}
            {samanLoaded && (
              <div className="bg-white p-1 rounded-md">
                <Image 
                  src="/images/samandehi.png" 
                  alt="نماد ساماندهی" 
                  width={70} 
                  height={70} 
                  className="h-16 w-auto object-contain"
                  onError={() => setSamanLoaded(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
