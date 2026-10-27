import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    // Shown as "<venueFull> (<venue> <year>)", e.g. "... Analysis (ISSTA 2025)".
    venue: z.string(),
    venueFull: z.string().optional(),
    date: z.coerce.date(),
    authors: z.array(z.string()),
    me: z.string().optional(),
    cofirst: z.boolean().optional(),
    corresponding: z.boolean().optional(),
    links: z
      .object({
        paper: z.url().optional(),
        website: z.url().optional(),
        code: z.url().optional(),
      })
      .optional(),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/awards" }),
  schema: z.object({
    title: z.string(),
    source: z.string(),
    date: z.coerce.date(),
  }),
});

// CV sections are small lists, so each lives in a single YAML file under
// src/content/cv/. The page sorts them newest first.
const year = z.number().int();
const period = {
  start: year,
  end: z.union([year, z.literal("present")]).optional(),
};

const education = defineCollection({
  loader: file("./src/content/cv/education.yaml"),
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    field: z.string(),
    ...period,
    details: z.array(z.string()).optional(),
  }),
});

// A role at an organization, with optional bullet points.
const roleEntry = z.object({
  role: z.string(),
  organization: z.string(),
  ...period,
  details: z.array(z.string()).optional(),
});

const experience = defineCollection({
  loader: file("./src/content/cv/experience.yaml"),
  schema: roleEntry,
});

const talks = defineCollection({
  loader: file("./src/content/cv/talks.yaml"),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    year,
  }),
});

const teaching = defineCollection({
  loader: file("./src/content/cv/teaching.yaml"),
  schema: roleEntry,
});

const service = defineCollection({
  loader: file("./src/content/cv/service.yaml"),
  schema: z.object({
    role: z.string(),
    venue: z.string().optional(),
    ...period,
  }),
});

export const collections = {
  publications,
  awards,
  education,
  experience,
  talks,
  teaching,
  service,
};
