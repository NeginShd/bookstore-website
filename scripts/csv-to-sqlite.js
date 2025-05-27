// اسکریپت تبدیل CSV به SQLite
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

const db = new sqlite3.Database(path.join(__dirname, '../books.db'));

const csvFiles = [
  {
    file: path.join(__dirname, '../src/data/books.csv'),
    table: 'books',
    columns: [
      'title TEXT',
      'author TEXT',
      'year INTEGER',
      'genre TEXT',
      'original_language TEXT',
      'translator TEXT',
      'summary TEXT',
      'publisher TEXT',
      'pages INTEGER',
      'ISBN TEXT PRIMARY KEY'
    ]
  },
  {
    file: path.join(__dirname, '../src/data/customers.csv'),
    table: 'customers',
    columns: [
      'full_name TEXT',
      'username TEXT',
      'email TEXT UNIQUE',
      'phone TEXT',
      'address TEXT',
      'gender TEXT',
      'birth_date TEXT',
      'register_date TEXT',
      'is_premium TEXT',
      'password TEXT'
    ]
  },
  {
    file: path.join(__dirname, '../src/data/staff.csv'),
    table: 'staff',
    columns: [
      'full_name TEXT',
      'username TEXT',
      'email TEXT UNIQUE',
      'job_title TEXT',
      'phone TEXT',
      'hire_date TEXT',
      'address TEXT',
      'national_id TEXT',
      'gender TEXT',
      'birth_date TEXT',
      'password TEXT'
    ]
  }
];

function prepareTable({ table, columns, file }) {
  return new Promise((resolve, reject) => {
    if (columns) {
      db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${table}`);
        db.run(`CREATE TABLE IF NOT EXISTS ${table} (${columns.join(', ')})`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      // اگر ستون‌ها مشخص نیست، هدر CSV را می‌خوانیم
      let headers = [];
      fs.createReadStream(file)
        .pipe(csv())
        .on('headers', (h) => {
          headers = h;
          const colDefs = headers.map(col => `${col} TEXT`);
          db.serialize(() => {
            db.run(`DROP TABLE IF EXISTS ${table}`);
            db.run(`CREATE TABLE IF NOT EXISTS ${table} (${colDefs.join(', ')})`, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        })
        .on('error', reject)
        .on('end', () => {});
    }
  });
}

function importCSV({ file, table }) {
  return new Promise((resolve, reject) => {
    let headers = [];
    const rows = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('headers', (h) => {
        headers = h;
      })
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        if (rows.length === 0) return resolve();
        const placeholders = headers.map(() => '?').join(', ');
        const insert = db.prepare(`INSERT OR REPLACE INTO ${table} (${headers.join(',')}) VALUES (${placeholders})`);
        db.serialize(() => {
          rows.forEach(row => {
            insert.run(headers.map(h => row[h]));
          });
          insert.finalize();
          console.log(`Imported ${rows.length} rows into ${table}`);
          resolve();
        });
      })
      .on('error', reject);
  });
}

(async () => {
  for (const csvFile of csvFiles) {
    await prepareTable(csvFile);
    await importCSV(csvFile);
  }
  db.close();
})(); 