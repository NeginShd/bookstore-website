#!/usr/bin/env node

// This script runs the TypeScript update-book-covers script

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting book cover update process...');

// Path to the TypeScript file
const scriptPath = path.join(__dirname, 'update-book-covers.ts');

// Run the script using ts-node
const tsNode = spawn('npx', ['ts-node', scriptPath], {
  stdio: 'inherit', // This will pipe the script's output to this process
  shell: true
});

tsNode.on('close', (code) => {
  if (code === 0) {
    console.log('Book cover update completed successfully');
  } else {
    console.error(`Book cover update process exited with code ${code}`);
  }
}); 