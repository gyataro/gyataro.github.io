import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import {
  awardSchema,
  educationSchema,
  publicationSchema,
  roleSchema,
  serviceSchema,
  talkSchema,
} from "./content/schemas";

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: publicationSchema,
});

const awards = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/awards" }),
  schema: awardSchema,
});

// CV sections are small lists, so each lives in a single YAML file under
// src/content/cv/. The page sorts them newest first.
const education = defineCollection({
  loader: file("./src/content/cv/education.yaml"),
  schema: educationSchema,
});

const experience = defineCollection({
  loader: file("./src/content/cv/experience.yaml"),
  schema: roleSchema,
});

const talks = defineCollection({
  loader: file("./src/content/cv/talks.yaml"),
  schema: talkSchema,
});

const teaching = defineCollection({
  loader: file("./src/content/cv/teaching.yaml"),
  schema: roleSchema,
});

const service = defineCollection({
  loader: file("./src/content/cv/service.yaml"),
  schema: serviceSchema,
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
