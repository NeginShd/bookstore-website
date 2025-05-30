/**
 * Database backup script
 * 
 * This script creates a backup of the SQLite database
 * and stores it in the backups directory with a timestamp.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function createBackup() {
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const dbPath = path.join(process.cwd(), '..', '..', 'books.db');
  const backupPath = path.join(__dirname, `backup_${timestamp}.db`);
  
  // Check if source database exists
  if (!fs.existsSync(dbPath)) {
    console.error(`Database file not found at ${dbPath}`);
    return;
  }
  
  // Create a backup using SQLite's backup command
  const command = `sqlite3 "${dbPath}" ".backup '${backupPath}'"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating backup: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Backup error: ${stderr}`);
      return;
    }
    
    console.log(`Database backup created successfully at ${backupPath}`);
    
    // Clean up old backups (keep only the 5 most recent)
    const backupDir = __dirname;
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup_') && file.endsWith('.db'))
      .sort()
      .reverse();
    
    if (backupFiles.length > 5) {
      console.log('Cleaning up old backups...');
      
      for (let i = 5; i < backupFiles.length; i++) {
        const oldBackupPath = path.join(backupDir, backupFiles[i]);
        fs.unlinkSync(oldBackupPath);
        console.log(`Deleted old backup: ${backupFiles[i]}`);
      }
    }
  });
}

// Run backup if this file is executed directly
if (require.main === module) {
  createBackup();
}

module.exports = { createBackup }; 