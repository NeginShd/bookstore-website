// Export database functions and types
export * from './database';

// Also export CommonJS database functions
import { getDb } from './db';
export { getDb }; 