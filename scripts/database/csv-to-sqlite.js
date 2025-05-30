// اسکریپت تبدیل CSV به SQLite
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

const db = new sqlite3.Database(path.join(__dirname, '../books.db'));

const booksConfig = {
  file: path.join(__dirname, '../../database/data/books.csv'),
  tableName: 'books',
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
};

const customersConfig = {
  file: path.join(__dirname, '../../database/data/customers.csv'),
  tableName: 'customers',
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
};

const staffConfig = {
  file: path.join(__dirname, '../../database/data/staff.csv'),
  tableName: 'staff',
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
};

function prepareTable({ tableName, columns }) {
  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      const createTableSQL = `CREATE TABLE ${tableName} (${columns.join(', ')})`;
      db.run(createTableSQL, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log(`Table ${tableName} created successfully`);
        resolve();
      });
    });
  });
}

function importCSV({ file, tableName }) {
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
        const insert = db.prepare(`INSERT OR REPLACE INTO ${tableName} (${headers.join(',')}) VALUES (${placeholders})`);
        db.serialize(() => {
          rows.forEach(row => {
            insert.run(headers.map(h => row[h]));
          });
          insert.finalize();
          console.log(`Imported ${rows.length} rows into ${tableName}`);
          resolve();
        });
      })
      .on('error', reject);
  });
}

(async () => {
  await prepareTable(booksConfig);
  await importCSV(booksConfig);
  await prepareTable(customersConfig);
  await importCSV(customersConfig);
  await prepareTable(staffConfig);
  await importCSV(staffConfig);
  db.close();
})(); 