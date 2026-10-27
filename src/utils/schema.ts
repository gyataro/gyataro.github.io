import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/config/site";

const id = (fragment: string) => `${siteConfig.url}/#${fragment}`;

const PERSON_ID = id("person");
const WEBSITE_ID = id("website");

interface ProfileSchemaInput {
  imageUrl: string;
  dateModified: Date;
  publications: CollectionEntry<"publications">[];
  awards: CollectionEntry<"awards">[];
}

// A single JSON-LD graph for the homepage. Every node references the same
// Person by @id, so search engines can tie the site, the profile and each
// paper's author list to one entity.
export function buildProfileSchema({
  imageUrl,
  dateModified,
  publications,
  awards,
}: ProfileSchemaInput) {
  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.name,
    alternateName: [
      siteConfig.alternateName,
      siteConfig.chineseName.hanzi,
      // Pinyin without tone marks, as people type it into search.
      siteConfig.chineseName.pinyin.normalize("NFD").replace(/\p{M}/gu, ""),
    ],
    givenName: siteConfig.givenName,
    familyName: siteConfig.familyName,
    url: siteConfig.url,
    image: imageUrl,
    email: `mailto:${siteConfig.email}`,
    jobTitle: siteConfig.jobTitle,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.university.name,
      url: siteConfig.university.url,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.alumniOf.name,
      url: siteConfig.alumniOf.url,
    },
    knowsAbout: siteConfig.knowsAbout,
    award: awards.map(({ data }) => `${data.title}, ${data.source}`),
    sameAs: [
      ...siteConfig.socialLinks.map((link) => link.href),
      ...siteConfig.otherProfiles,
    ],
  };

  const articles = publications.map(({ data }) => ({
    "@type": "ScholarlyArticle",
    headline: data.title,
    name: data.title,
    datePublished: data.date.toISOString().slice(0, 10),
    author: data.authors.map((name) =>
      name.toLowerCase() === (data.me ?? siteConfig.name).toLowerCase()
        ? { "@id": PERSON_ID }
        : { "@type": "Person", name },
    ),
    isPartOf: {
      "@type": "CreativeWork",
      name: data.venueFull ?? data.venue,
      alternateName: data.venue,
    },
    ...(data.links?.paper && { url: data.links.paper }),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        inLanguage: siteConfig.lang,
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": id("profilepage"),
        url: `${siteConfig.url}/`,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { "@id": WEBSITE_ID },
        dateModified: dateModified.toISOString(),
        mainEntity: { "@id": PERSON_ID },
        hasPart: articles,
      },
      person,
    ],
  };
}
