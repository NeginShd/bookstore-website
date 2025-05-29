import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/contexts/ThemeContext'; // Added ThemeProvider
import { UserProvider } from '@/contexts/UserContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const vazirmatn = Vazirmatn({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

export const metadata: Metadata = {
  title: 'سبز',
  description: 'Your online bookstore for discovering and purchasing books.',
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.jpg", sizes: "32x32" },
      { url: "/logo.jpg", sizes: "16x16" },
      { url: "/logo.jpg", sizes: "48x48" },
    ],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg", // Used for Apple touch icons
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/logo.jpg",
      },
    ],
  },
  openGraph: {
    title: 'سبز',
    description: 'Your online bookstore for discovering and purchasing books.',
    images: [
      {
        url: "/logo.jpg", // Main Open Graph image
        width: 1200, // Recommended width for OG images
        height: 630, // Recommended height for OG images
        alt: 'لوگو سبز',
      },
    ],
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سبز',
    description: 'Your online bookstore for discovering and purchasing books.',
    images: ["/logo.jpg"], // Twitter card image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={`font-sans antialiased`}>
        <UserProvider>
          <ThemeProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </UserProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
