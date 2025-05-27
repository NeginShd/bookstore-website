
'use server';
/**
 * @fileOverview A Genkit flow to generate insights about a book.
 *
 * - generateBookInsights - A function that provides AI-generated insights for a book.
 * - BookInsightsInput - The input type for the generateBookInsights function.
 * - BookInsightsOutput - The return type for the generateBookInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookInsightsInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  description: z.string().describe('A short description or synopsis of the book.'),
});
export type BookInsightsInput = z.infer<typeof BookInsightsInputSchema>;

const BookInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise and engaging summary of the book.'),
  keyThemes: z.array(z.string()).describe('A list of 2 to 3 prominent key themes or topics explored in the book.'),
  targetAudience: z.string().describe('A brief description of the ideal reader or target audience for this book.'),
});
export type BookInsightsOutput = z.infer<typeof BookInsightsOutputSchema>;

export async function generateBookInsights(input: BookInsightsInput): Promise<BookInsightsOutput> {
  return bookInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookInsightsPrompt',
  input: {schema: BookInsightsInputSchema},
  output: {schema: BookInsightsOutputSchema},
  prompt: `You are a knowledgeable and insightful literary assistant.
Based on the provided book title, author, and description, please generate the following insights:
1.  A concise and engaging summary of the book (around 100-150 words).
2.  A list of 2 to 3 prominent key themes or topics explored in the book.
3.  A brief description of the ideal reader or target audience for this book.

Please ensure your response is structured according to the output schema and the content is engaging for a potential reader.

Book Title: {{{title}}}
Book Author: {{{author}}}
Book Description: {{{description}}}
`,
});

const bookInsightsFlow = ai.defineFlow(
  {
    name: 'bookInsightsFlow',
    inputSchema: BookInsightsInputSchema,
    outputSchema: BookInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
