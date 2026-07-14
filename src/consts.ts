// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const NAME = 'Xiwen Teoh'
export const GITHUB_LINK = "https://github.com/gyataro"
export const LINKEDIN_LINK = "https://www.linkedin.com/in/xiwenteoh/"
export const SCHOLAR_LINK = "https://scholar.google.com/citations?user=BBOJEwQAAAAJ&hl=en"
export const EMAIL_LINK = "mailto:xiwen.teoh@nus.edu.sg"
export const ORCID_LINK = "https://orcid.org/0009-0009-8528-9088"

export const EXTERNAL_LINK_ATTRS = { target: "_blank", rel: "noopener noreferrer" } as const

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