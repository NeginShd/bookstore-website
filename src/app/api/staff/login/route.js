import { getDb } from '../../../../lib/db';
const bcrypt = require('bcrypt');

export async function POST(req) {
  const db = getDb();
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      db.close();
      return new Response(JSON.stringify({ error: 'ایمیل و رمز عبور اجباری هستند.' }), { status: 400 });
    }

    // یافتن کارمند بر اساس ایمیل
    const staffUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM staff WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!staffUser) {
      db.close();
      return new Response(JSON.stringify({ error: 'کارمندی با این ایمیل یافت نشد.' }), { status: 404 });
    }

    // مقایسه رمز عبور وارد شده با رمز عبور هش شده
    // توجه: در داده‌های اولیه CSV رمز عبورها خالی هستند و باید ابتدا تنظیم شوند.
    const passwordMatch = await bcrypt.compare(password, staffUser.password);

    if (!passwordMatch) {
      db.close();
      return new Response(JSON.stringify({ error: 'رمز عبور اشتباه است.' }), { status: 401 });
    }

    // ورود موفقیت‌آمیز (می‌توان توکن JWT یا session اضافه کرد)
    db.close();
    return new Response(JSON.stringify({ message: 'ورود کارمند موفقیت‌آمیز.', staffUser: { id: staffUser.id, email: staffUser.email, username: staffUser.username, job_title: staffUser.job_title } }), { status: 200 });

  } catch (error) {
    db.close();
    console.error('Staff Login error:', error);
    return new Response(JSON.stringify({ error: 'خطا در پردازش درخواست ورود کارمند.' }), { status: 500 });
  }
} 