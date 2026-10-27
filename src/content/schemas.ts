// Content schemas, shared by the Astro collections (src/content.config.ts) and
// the CV generator (scripts/build-cv.ts). Kept free of Astro-only imports so
// plain Node can load it; relative imports elsewhere in that chain use
// explicit .ts extensions for the same reason.
import { z } from "astro/zod";

// Optional per-entry CV adjustments. Any key other than the two directives is
// a RenderCV entry field that replaces the generated value (null removes it).
export const cvOverride = z
  .looseObject({
    // Leave this entry off the CV.
    hidden: z.boolean().optional(),
    // Publications only: list under "Selected Publications".
    selected: z.boolean().optional(),
  })
  .optional();

export const publicationSchema = z.object({
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
  cv: cvOverride,
});

export const awardSchema = z.object({
  title: z.string(),
  source: z.string(),
  date: z.coerce.date(),
  cv: cvOverride,
});

const year = z.number().int();
const period = {
  start: year,
  end: z.union([year, z.literal("present")]).optional(),
};

export const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  field: z.string(),
  ...period,
  details: z.array(z.string()).optional(),
  cv: cvOverride,
});

// A role at an organization, with optional bullet points.
export const roleSchema = z.object({
  role: z.string(),
  organization: z.string(),
  ...period,
  details: z.array(z.string()).optional(),
  cv: cvOverride,
});

export const talkSchema = z.object({
  title: z.string(),
  event: z.string(),
  year,
  cv: cvOverride,
});

export const serviceSchema = z.object({
  role: z.string(),
  venue: z.string().optional(),
  ...period,
  cv: cvOverride,
});

export type Publication = z.infer<typeof publicationSchema>;
export type Award = z.infer<typeof awardSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Talk = z.infer<typeof talkSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type CvOverride = z.infer<typeof cvOverride>;
