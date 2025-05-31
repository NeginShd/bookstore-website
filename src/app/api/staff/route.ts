import { NextResponse } from 'next/server';
import { getDb } from '@/lib/database/db';

export async function GET() {
  try {
    const db = getDb();
    
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM staff', [], (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    return NextResponse.json({ staff: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 