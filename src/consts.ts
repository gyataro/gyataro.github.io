// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const NAME = 'Xiwen Teoh'
// Surname-first order, common in Malaysian/Chinese naming convention searches.
export const ALTERNATE_NAME = 'Teoh Xiwen'
export const GITHUB_LINK = "https://github.com/gyataro"
export const LINKEDIN_LINK = "https://www.linkedin.com/in/xiwenteoh/"
export const SCHOLAR_LINK = "https://scholar.google.com/citations?user=BBOJEwQAAAAJ&hl=en"
export const EMAIL_LINK = "mailto:xiwen.teoh@nus.edu.sg"
export const ORCID_LINK = "https://orcid.org/0009-0009-8528-9088"

export const EXTERNAL_LINK_ATTRS = { target: "_blank", rel: "noopener noreferrer" } as const

export const PERSON_SCHEMA = {
  "@type": "Person",
  "name": NAME,
  "alternateName": ALTERNATE_NAME,
  "url": "https://xiwen.me",
  "image": "https://xiwen.me/profile.jpg",
  "jobTitle": "PhD Student",
  "affiliation": {
    "@type": "Organization",
    "name": "National University of Singapore",
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

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map(({ name, path }, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": { "id": `https://xiwen.me${path}`, "name": name }
    }))
  }
}

export function getPageSchema(pathname: string): Record<string, any> {
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
      "mainEntity": PERSON_SCHEMA
    }
  }

  if (normalized === '/publications') {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Publications - Xiwen Teoh",
      "url": "https://xiwen.me/publications",
      "breadcrumb": breadcrumb([
        { name: "About Me", path: "/" },
        { name: "Publications", path: "/publications" }
      ]),
      "about": PERSON_SCHEMA
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
      "about": PERSON_SCHEMA
    }
  }

  return {}
}

export const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Xiwen Teoh',
    description: "Xiwen Teoh's personal website. Learn more about me and my research. Catch a glimpse of my life.",
  },
  '/publications': {
    title: 'Publications • Xiwen Teoh',
    description: 'Complete list of publications by Xiwen Teoh.',
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