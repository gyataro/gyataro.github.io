import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    year: z.number(),
    date: z.coerce.date(),
    authors: z.array(z.string()),
    me: z.string().optional(),
    cofirst: z.boolean().optional(),
    corresponding: z.boolean().optional(),
    links: z
      .object({
        paper: z.string().url().optional(),
        website: z.string().url().optional(),
        code: z.string().url().optional(),
      })
      .optional(),
    selected: z.boolean()
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { publications, awards };
