const { getDb } = require('../../../lib/db');
const bcrypt = require('bcrypt');

export async function POST(req) {
  const db = getDb();
  try {
    const { full_name, username, email, password } = await req.json();

    if (!full_name || !username || !email || !password) {
      db.close();
      return new Response(JSON.stringify({ error: 'تمام فیلدها اجباری هستند.' }), { status: 400 });
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
      return new Response(JSON.stringify({ error: 'کاربری با این ایمیل قبلاً ثبت نام کرده است.' }), { status: 409 });
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // درج کاربر جدید در پایگاه داده
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO customers (full_name, username, email, password, phone, address, gender, birth_date, register_date, is_premium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [full_name, username, email, hashedPassword, '', '', '', new Date().toISOString().split('T')[0], 'خیر'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    db.close();
    return new Response(JSON.stringify({ message: 'ثبت نام با موفقیت انجام شد.', userId: result }), { status: 201 });

  } catch (error) {
    db.close();
    console.error('Register error:', error);
    return new Response(JSON.stringify({ error: 'خطا در پردازش درخواست ثبت نام.' }), { status: 500 });
  }
}
 