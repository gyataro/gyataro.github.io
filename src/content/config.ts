import { defineCollection, z } from 'astro:content';

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    year: z.number(),
    date: z.preprocess((v) => (typeof v === 'string' ? new Date(v) : v), z.date()),
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.preprocess((v) => (typeof v === 'string' ? new Date(v) : v), z.date())
  }),
});

export const collections = { publications, awards };