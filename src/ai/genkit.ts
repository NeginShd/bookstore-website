import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API key is available
const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!hasApiKey) {
  console.warn('⚠️  Google Gemini API key not found. AI features will be disabled.');
  console.warn('   Add GEMINI_API_KEY to your .env.local file to enable AI features.');
}

export const ai = genkit({
  plugins: hasApiKey ? [googleAI()] : [],
  model: hasApiKey ? 'googleai/gemini-1.5-flash' : undefined,
});
