/**
 * Database directory setup script
 * 
 * This script organizes the database directory structure
 * and ensures all necessary folders and files exist.
 */

const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function setup() {
  const databaseDir = __dirname;
  
  // Ensure migrations directory exists
  const migrationsDir = path.join(databaseDir, 'migrations');
  ensureDirectoryExists(migrationsDir);
  
  // Ensure backups directory exists
  const backupsDir = path.join(databaseDir, 'backups');
  ensureDirectoryExists(backupsDir);
  
  // Create a .gitkeep file in each directory to ensure they're tracked by git
  const migrationsDirGitKeep = path.join(migrationsDir, '.gitkeep');
  if (!fs.existsSync(migrationsDirGitKeep)) {
    fs.writeFileSync(migrationsDirGitKeep, '');
    console.log(`Created file: ${migrationsDirGitKeep}`);
  }
  
  const backupsDirGitKeep = path.join(backupsDir, '.gitkeep');
  if (!fs.existsSync(backupsDirGitKeep)) {
    fs.writeFileSync(backupsDirGitKeep, '');
    console.log(`Created file: ${backupsDirGitKeep}`);
  }
  
  console.log('Database directory structure has been organized successfully.');
}

// Run setup if this file is executed directly
if (require.main === module) {
  setup();
}

module.exports = { setup }; 