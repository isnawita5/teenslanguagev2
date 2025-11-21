'use server';

/**
 * @fileOverview A flow to generate a comic strip from example sentences.
 *
 * - generateComicStrip - A function that handles the comic generation process.
 * - GenerateComicStripInput - The input type for the generateComicStrip function.
 * - GenerateComicStripOutput - The return type for the generateComicStrip function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateComicStripInputSchema = z.object({
  termPhrase: z.string().describe('The term or phrase to illustrate.'),
  exampleSentences: z.array(z.string()).describe('The example sentences forming a conversation.'),
  language: z.enum(['en', 'id']).describe('The language for the comic. Can be "en" for English or "id" for Indonesian.'),
});
export type GenerateComicStripInput = z.infer<typeof GenerateComicStripInputSchema>;

// The output is just the image data URI string
const GenerateComicStripOutputSchema = z.string().describe("A data URI of the generated comic strip image. Format: 'data:image/png;base64,<encoded_data>'.");
export type GenerateComicStripOutput = z.infer<typeof GenerateComicStripOutputSchema>;

export async function generateComicStrip(input: GenerateComicStripInput): Promise<GenerateComicStripOutput> {
  return generateComicStripFlow(input);
}

const generateComicStripFlow = ai.defineFlow(
  {
    name: 'generateComicStripFlow',
    inputSchema: GenerateComicStripInputSchema,
    outputSchema: GenerateComicStripOutputSchema,
  },
  async (input) => {
    // Use Pollinations.ai for AI image generation
    // Server-side fetch to avoid Next.js Image optimization timeouts
    const prompt = `Minimalist 4-panel comic strip illustration, simple line art style, black and white cartoon. Theme: "${input.termPhrase}". Scene description: ${input.exampleSentences.join(' ')}. Clean, expressive characters. No text, no speech bubbles, visual storytelling only.`;

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&model=flux`;

    try {
      // Fetch the image from Pollinations.ai
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      // Convert to buffer then to base64
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      // Return as data URI
      const dataUri = `data:image/jpeg;base64,${base64}`;
      return dataUri;
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw new Error('Failed to generate comic illustration');
    }
  }
);
