const { getDb } = require('../../../lib/db');

export async function GET(req, res) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all('SELECT * FROM staff', [], (err, rows) => {
      db.close();
      if (err) {
        resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      } else {
        resolve(new Response(JSON.stringify(rows), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }));
      }
    });
  });
} 