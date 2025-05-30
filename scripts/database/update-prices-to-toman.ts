import { getDatabase } from '../src/lib/database';

interface BookForPricing {
  id: number;
  title: string;
  author: string;
  year: number | null;
  genre: string;
  original_language: string;
  publisher: string;
  pages: number | null;
  is_hot: number;
  is_new: number;
  rating: number;
}

// Generate realistic prices in Toman based on book characteristics
function generateRealisticPrice(book: BookForPricing): number {
  let basePrice = 0;
  
  // Base price by genre and content type
  const genrePricing: { [key: string]: [number, number] } = {
    'رمان': [180000, 350000],              // رمان‌های ادبی
    'داستانی': [150000, 280000],           // داستان‌های کوتاه
    'رئالیسم جادویی': [200000, 400000],     // رمان‌های پیچیده
    'تمثیلی': [160000, 300000],            // ادبیات تمثیلی
    'خاطرات': [140000, 250000],            // کتاب‌های خاطرات
    'سفرنامه': [120000, 220000],           // سفرنامه‌ها
    'شعر': [100000, 200000],               // مجموعه شعر
    'داستان کوتاه': [130000, 240000],      // مجموعه داستان
    'خودآموز': [80000, 180000],            // کتاب‌های آموزشی
    'فانتزی': [160000, 320000],            // فانتزی
    'داستان کودک': [60000, 150000]        // کتاب‌های کودک
  };
  
  const [minPrice, maxPrice] = genrePricing[book.genre] || [150000, 300000];
  basePrice = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  
  // Adjust for language (imported books are usually more expensive)
  if (book.original_language !== 'فارسی') {
    basePrice *= 1.2; // ترجمه‌ها 20% گران‌تر
  }
  
  // Adjust for publication year (newer books tend to be more expensive)
  if (book.year && book.year >= 2020) {
    basePrice *= 1.15; // کتاب‌های جدید 15% گران‌تر
  } else if (book.year && book.year <= 1990) {
    basePrice *= 0.9; // کتاب‌های قدیمی 10% ارزان‌تر
  }
  
  // Adjust for page count
  if (book.pages) {
    if (book.pages > 500) {
      basePrice *= 1.2; // کتاب‌های ضخیم گران‌تر
    } else if (book.pages < 150) {
      basePrice *= 0.85; // کتاب‌های نازک ارزان‌تر
    }
  }
  
  // Adjust for popularity and rating
  if (book.is_hot) {
    basePrice *= 1.1; // کتاب‌های محبوب 10% گران‌تر
  }
  
  if (book.rating >= 4.5) {
    basePrice *= 1.05; // کتاب‌های با امتیاز بالا 5% گران‌تر
  }
  
  // Famous publishers premium
  const premiumPublishers = ['نشر ثالث', 'نشر چشمه', 'نشر نگاه', 'انتشارات جامی'];
  if (premiumPublishers.some(pub => book.publisher.includes(pub))) {
    basePrice *= 1.1;
  }
  
  // Round to nearest 5000 Toman for realistic pricing
  return Math.round(basePrice / 5000) * 5000;
}

export async function updatePricesToToman() {
  try {
    console.log('Connecting to database...');
    const db = await getDatabase();
    
    console.log('Fetching all books...');
    const books: BookForPricing[] = await db.all(`
      SELECT id, title, author, year, genre, original_language, 
             publisher, pages, is_hot, is_new, rating
      FROM books
      ORDER BY id
    `);
    
    console.log(`Found ${books.length} books to update prices`);
    
    // Update prices for each book
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const newPrice = generateRealisticPrice(book);
      
      await db.run(
        'UPDATE books SET price = ? WHERE id = ?',
        [newPrice, book.id]
      );
      
      console.log(`Updated book ${i + 1}/${books.length}: "${book.title}" - ${newPrice.toLocaleString('fa-IR')} تومان`);
    }
    
    console.log('\nPrice update completed successfully!');
    
    // Show price statistics
    const stats = await db.get(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
    `);
    
    console.log(`\nPrice Statistics:`);
    console.log(`- Minimum: ${Math.floor(stats.min_price).toLocaleString('fa-IR')} تومان`);
    console.log(`- Maximum: ${Math.floor(stats.max_price).toLocaleString('fa-IR')} تومان`);
    console.log(`- Average: ${Math.floor(stats.avg_price).toLocaleString('fa-IR')} تومان`);
    console.log(`- Total books: ${stats.total_books}`);
    
    // Show price breakdown by language
    const languageStats: Array<{
      original_language: string;
      min_price: number;
      max_price: number;
      avg_price: number;
      count: number;
    }> = await db.all(`
      SELECT 
        original_language,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as count
      FROM books
      GROUP BY original_language
      ORDER BY original_language
    `);
    
    console.log(`\nPrice by Language:`);
    languageStats.forEach(stat => {
      console.log(`- ${stat.original_language}: ${Math.floor(stat.avg_price).toLocaleString('fa-IR')} تومان (میانگین) - ${stat.count} کتاب`);
    });
    
  } catch (error) {
    console.error('Price update failed:', error);
    process.exit(1);
  }
}

// Run update if this file is executed directly
if (require.main === module) {
  updatePricesToToman();
} 