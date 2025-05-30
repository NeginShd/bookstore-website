const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Open the database
const db = new sqlite3.Database('books.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the books database.');
});

// Query to get books
db.all(`SELECT id, title, author, isbn, cover_image FROM books`, [], (err, rows) => {
  if (err) {
    console.error('Error querying database:', err.message);
    db.close();
    process.exit(1);
  }
  
  console.log(`Found ${rows.length} books in the database.`);
  
  // Save the result to a JSON file
  const outputFile = path.join(__dirname, 'books-info.json');
  fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`Book information saved to ${outputFile}`);
  
  // Close the database
  db.close();
}); 