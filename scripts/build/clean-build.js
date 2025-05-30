#!/usr/bin/env node

/**
 * This script cleans the .next directory to ensure a fresh build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const nextDir = path.join(__dirname, '..', '..', '.next');

console.log('Cleaning build artifacts...');

// Check if .next directory exists
if (fs.existsSync(nextDir)) {
  try {
    if (process.platform === 'win32') {
      // Windows requires different command to remove directory with contents
      execSync(`rmdir /s /q "${nextDir}"`, { stdio: 'inherit' });
    } else {
      // Unix-based systems
      execSync(`rm -rf "${nextDir}"`, { stdio: 'inherit' });
    }
    console.log('.next directory removed successfully');
  } catch (error) {
    console.error(`Error removing .next directory: ${error.message}`);
    process.exit(1);
  }
} else {
  console.log('.next directory does not exist, nothing to clean');
}

console.log('Clean completed successfully. You can now run "npm run build" for a fresh build.'); 