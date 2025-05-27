# کتاب آنلاین (Ketab Online) - فروشگاه کتاب آنلاین

یک وب‌سایت فروشگاه کتاب مدرن که با Next.js ساخته شده است. این پروژه امکانات جستجو، مرور کتاب‌ها، سبد خرید، و توصیه‌های هوشمند مبتنی بر هوش مصنوعی را ارائه می‌دهد.

## ویژگی‌ها

- 🔍 جستجو و مرور کتاب‌ها بر اساس ژانر
- 🛒 سبد خرید و فرآیند چک‌اوت
- 🤖 توصیه‌های هوشمند کتاب با AI
- 👥 مدیریت کاربران و کارکنان
- 📱 طراحی ریسپانسیو
- ⚡ بهینه‌سازی شده با Next.js 15

## نصب و راه‌اندازی

```bash
# نصب dependencies
npm install

# اجرای سرور توسعه
npm run dev

# ساخت برای تولید
npm run build

# اجرای نسخه تولید
npm start
```

## ساختار پروژه

```
├── src/
│   ├── app/          # صفحات و routing
│   ├── components/   # کامپوننت‌های React
│   ├── lib/          # توابع کمکی
│   ├── hooks/        # Custom hooks
│   ├── contexts/     # React contexts
│   └── ai/           # ماژول‌های هوش مصنوعی
├── public/           # فایل‌های استاتیک
├── scripts/          # اسکریپت‌های کمکی
├── docs/             # مستندات
└── books.db          # پایگاه داده SQLite

```

برای شروع، فایل `src/app/page.tsx` را بررسی کنید.

## تکنولوژی‌های استفاده شده

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: SQLite
- **AI**: Google Genkit
- **State Management**: React Query, Context API
