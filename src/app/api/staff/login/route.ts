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

    // یافتن کارمند بر اساس ایمیل
    const staffUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM staff WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!staffUser) {
      db.close();
      return NextResponse.json(
        { error: 'کارمندی با این ایمیل یافت نشد.' },
        { status: 404 }
      );
    }

    // مقایسه رمز عبور وارد شده با رمز عبور هش شده
    // توجه: در داده‌های اولیه CSV رمز عبورها خالی هستند و باید ابتدا تنظیم شوند.
    const passwordMatch = await bcrypt.compare(password, staffUser.password);

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
        message: 'ورود کارمند موفقیت‌آمیز.',
        staffUser: { 
          id: staffUser.id, 
          email: staffUser.email, 
          username: staffUser.username, 
          job_title: staffUser.job_title 
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Staff Login error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست ورود کارمند.' },
      { status: 500 }
    );
  }
} 