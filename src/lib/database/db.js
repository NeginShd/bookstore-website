const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// استفاده از مسیر مطلق برای پایگاه داده
const dbPath = path.resolve(process.cwd(), 'database', 'books.db');

function getDb() {
  return new sqlite3.Database(dbPath);
}

module.exports = { getDb }; 