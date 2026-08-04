// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { getImage } from 'astro:assets'
import profileImg from './assets/profile.jpg'

export const NAME = 'Xiwen Teoh'
// Surname-first order, common in Malaysian/Chinese naming convention searches.
export const ALTERNATE_NAME = 'Teoh Xiwen'
export const GITHUB_LINK = "https://github.com/gyataro"
export const LINKEDIN_LINK = "https://www.linkedin.com/in/xiwenteoh/"
export const SCHOLAR_LINK = "https://scholar.google.com/citations?user=BBOJEwQAAAAJ&hl=en"
export const EMAIL_LINK = "mailto:xiwen.teoh@nus.edu.sg"
export const ORCID_LINK = "https://orcid.org/0009-0009-8528-9088"

export const EXTERNAL_LINK_ATTRS = { target: "_blank", rel: "noopener noreferrer" } as const

export const JOB_TITLE = 'PhD Candidate'
export const FIELD = 'Computer Science'
export const UNIVERSITY = 'National University of Singapore'

const PERSON_SCHEMA_BASE = {
  "@type": "Person",
  "name": NAME,
  "alternateName": ALTERNATE_NAME,
  "url": "https://xiwen.me",
  "jobTitle": JOB_TITLE,
  "affiliation": {
    "@type": "Organization",
    "name": UNIVERSITY,
    "url": "https://www.nus.edu.sg"
  },
  "sameAs": [
    LINKEDIN_LINK,
    GITHUB_LINK,
    SCHOLAR_LINK,
    ORCID_LINK
  ],
  "email": "xiwen.teoh@nus.edu.sg",
  "knowsAbout": [
    "GUI Testing",
    "Web Security",
    "AI Agents"
  ]
}

async function getPersonSchema() {
  const img = await getImage({ src: profileImg })
  return { ...PERSON_SCHEMA_BASE, "image": `https://xiwen.me${img.src}` }
}

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map(({ name, path }, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": { "@id": `https://xiwen.me${path}`, "name": name }
    }))
  }
}

export async function getPageSchema(pathname: string): Promise<Record<string, unknown>> {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')

  if (normalized === '/') {
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "name": "Xiwen Teoh - Personal Website",
      "url": "https://xiwen.me",
      "breadcrumb": breadcrumb([
        { name: "About Me", path: "/" },
        { name: "Publications", path: "/publications" }
      ]),
      "mainEntity": await getPersonSchema()
    }
  }

  if (normalized === '/awards') {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Awards - Xiwen Teoh",
      "url": "https://xiwen.me/awards",
      "breadcrumb": breadcrumb([
        { name: "About Me", path: "/" },
        { name: "Awards", path: "/awards" }
      ]),
      "about": await getPersonSchema()
    }
  }

  return {}
}

type PublicationLike = {
  title: string
  venue: string
  date: Date
  authors: string[]
  links?: { paper?: string; website?: string }
}

export async function getPublicationsSchema(publications: PublicationLike[]): Promise<Record<string, unknown>> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Publications - Xiwen Teoh",
    "url": "https://xiwen.me/publications",
    "breadcrumb": breadcrumb([
      { name: "About Me", path: "/" },
      { name: "Publications", path: "/publications" }
    ]),
    "about": await getPersonSchema(),
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": publications.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "ScholarlyArticle",
          "name": p.title,
          "headline": p.title,
          "author": p.authors.map((name) => ({ "@type": "Person", "name": name })),
          "datePublished": p.date.toISOString().slice(0, 10),
          "isPartOf": { "@type": "CreativeWork", "name": p.venue },
          ...(p.links?.paper && { "url": p.links.paper }),
        }
      }))
    }
  }
}

export const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Xiwen Teoh',
    description: 'Xiwen Teoh is a PhD Candidate in Computer Science at the National University of Singapore, researching GUI testing, web security, and AI agents.',
  },
  '/publications': {
    title: 'Publications • Xiwen Teoh',
    description: 'Complete list of publications by Xiwen Teoh, PhD Candidate in Computer Science at the National University of Singapore (NUS).',
  },
  '/awards': {
    title: 'Awards • Xiwen Teoh',
    description: 'Awards and recognition received by Xiwen Teoh.',
  }
}

export function getPageMeta(pathname: string) {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const not_found = {title: '404 • Page Not Found', description: 'The page you are looking for does not exist.'}
  return PAGE_META[normalized] ?? not_found
}