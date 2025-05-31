import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const db = getDb();
    const { full_name, username, email, password } = await req.json();

    if (!full_name || !username || !email || !password) {
      db.close();
      return NextResponse.json(
        { error: 'تمام فیلدها اجباری هستند.' },
        { status: 400 }
      );
    }

    // بررسی وجود کاربر با ایمیل تکراری
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT email FROM customers WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      db.close();
      return NextResponse.json(
        { error: 'کاربری با این ایمیل قبلاً ثبت نام کرده است.' },
        { status: 409 }
      );
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);
    const currentDate = new Date().toISOString().split('T')[0];

    // درج کاربر جدید در پایگاه داده
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO customers (full_name, username, email, password, phone, address, gender, birth_date, register_date, is_premium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [full_name, username, email, hashedPassword, '', '', '', '', currentDate, 'خیر'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    db.close();
    return NextResponse.json(
      { message: 'ثبت نام با موفقیت انجام شد.', userId: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست ثبت نام.' },
      { status: 500 }
    );
  }
}
 