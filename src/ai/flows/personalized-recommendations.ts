// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized book recommendations
 * based on a user's browsing and purchase history.
 *
 * - personalizedRecommendations - A function that returns personalized book recommendations.
 * - PersonalizedRecommendationsInput - The input type for the personalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The output type for the personalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe(
      'A comma separated list of book titles the user has recently viewed.'
    ),
  purchaseHistory: z
    .string()
    .describe(
      'A comma separated list of book titles the user has previously purchased.'
    ),
});

export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A comma separated list of book titles recommended to the user.'
    ),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function personalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a personal book recommendation assistant. You take a user's
browsing history and purchase history and return a list of books they might
like. Do not recommend books that the user has already purchased or browsed.

Browsing History: {{{browsingHistory}}}
Purchase History: {{{purchaseHistory}}}

Recommendations: `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
