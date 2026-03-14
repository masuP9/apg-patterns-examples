import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const accessibilityDocs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/accessibility-docs' }),
  schema: z.object({
    pattern: z.string(),
    locale: z.enum(['en', 'ja']),
  }),
});

export const collections = { 'accessibility-docs': accessibilityDocs };
