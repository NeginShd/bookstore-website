import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const db = getDb();
    const { email, password } = await req.json();

    if (!email || !password) {
      db.close();
      return NextResponse.json(
        { error: 'ایمیل و رمز عبور اجباری هستند.' },
        { status: 400 }
      );
    }

    // یافتن کاربر بر اساس ایمیل
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM customers WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      db.close();
      return NextResponse.json(
        { error: 'کاربری با این ایمیل یافت نشد.' },
        { status: 404 }
      );
    }

    // مقایسه رمز عبور وارد شده با رمز عبور هش شده
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      db.close();
      return NextResponse.json(
        { error: 'رمز عبور اشتباه است.' },
        { status: 401 }
      );
    }

    // ورود موفقیت‌آمیز (می‌توان توکن JWT یا session اضافه کرد)
    db.close();
    return NextResponse.json(
      { 
        message: 'ورود موفقیت‌آمیز.',
        user: { id: user.id, email: user.email, username: user.username }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست ورود.' },
      { status: 500 }
    );
  }
} 