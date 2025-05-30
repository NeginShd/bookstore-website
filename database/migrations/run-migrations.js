/**
 * Database migration runner
 * 
 * This script runs all SQL migration files in the migrations directory
 * in numerical order.
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function runMigrations() {
  // Get database path
  const dbPath = path.join(process.cwd(), 'books.db');
  
  // Open database connection
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');
  
  console.log(`Connected to database at ${dbPath}`);
  
  // Create migrations table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Get all migration files
  const migrationsDir = path.join(__dirname);
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log(`Found ${migrationFiles.length} migration files`);
  
  // Get already applied migrations
  const appliedMigrations = await db.all('SELECT name FROM migrations');
  const appliedMigrationNames = appliedMigrations.map(m => m.name);
  
  // Run migrations that haven't been applied yet
  for (const migrationFile of migrationFiles) {
    if (appliedMigrationNames.includes(migrationFile)) {
      console.log(`Migration ${migrationFile} already applied, skipping`);
      continue;
    }
    
    console.log(`Running migration ${migrationFile}...`);
    
    // Read migration file
    const migrationPath = path.join(migrationsDir, migrationFile);
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    // Run migration in a transaction
    try {
      await db.exec('BEGIN TRANSACTION');
      await db.exec(migration);
      await db.run('INSERT INTO migrations (name) VALUES (?)', migrationFile);
      await db.exec('COMMIT');
      
      console.log(`Migration ${migrationFile} applied successfully`);
    } catch (error) {
      await db.exec('ROLLBACK');
      console.error(`Error applying migration ${migrationFile}: ${error.message}`);
      process.exit(1);
    }
  }
  
  console.log('All migrations applied successfully');
  await db.close();
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().catch(error => {
    console.error('Migration runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations }; 