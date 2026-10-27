const CV_PATH = "/Xiwen_Teoh_CV.pdf";

export const siteConfig = {
  name: "Xiwen Teoh",
  // Surname-first order, common in Malaysian/Chinese naming convention searches.
  alternateName: "Teoh Xiwen",
  chineseName: {
    hanzi: "张曦文",
    pinyin: "Zhāng Xīwén",
    ipa: "ʈʂɑŋ˥ ɕi˥ wən˧˥",
  },
  // How the English name is said (confirmed by Xiwen); IPA plus a
  // plain-English respelling.
  pronunciation: {
    ipa: "ˈʃiːwɛn ˈtiːoʊ",
    respelling: "SHEE-wen TEE-oh",
  },
  givenName: "Xiwen",
  familyName: "Teoh",
  url: "https://xiwen.me",
  lang: "en",
  locale: "en_US",
  title: "Xiwen Teoh · PhD Candidate in Computer Science, NUS",
  description:
    "Xiwen Teoh (Teoh Xiwen) is a PhD candidate in Computer Science at the National University of Singapore, building AI agents for GUI testing, web security, and phishing detection.",
  jobTitle: "PhD Candidate",
  field: "Computer Science",
  university: {
    name: "National University of Singapore",
    shortName: "NUS",
    url: "https://www.nus.edu.sg",
  },
  alumniOf: {
    name: "Shanghai Jiao Tong University",
    url: "https://www.sjtu.edu.cn",
  },
  email: "xiwen.teoh@u.nus.edu",
  cvPath: CV_PATH,
  knowsAbout: [
    "AI Agents",
    "GUI Testing",
    "Web Security",
    "Phishing Detection",
    "Software Engineering",
  ],
  // Profiles listed only in structured data (sameAs), not shown on the page,
  // to help search engines tie these academic records to this site.
  otherProfiles: [
    "https://dblp.org/pid/381/1686.html",
    "https://www.semanticscholar.org/author/Xiwen-Teoh/2312305564",
  ],
  // `label` doubles as the RenderCV network name; `username` is what the CV
  // header shows for it.
  socialLinks: [
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=BBOJEwQAAAAJ&hl=en",
      icon: "scholar",
      username: "BBOJEwQAAAAJ",
    },
    {
      label: "GitHub",
      href: "https://github.com/gyataro",
      icon: "github",
      username: "gyataro",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/xiwenteoh/",
      icon: "linkedin",
      username: "xiwenteoh",
    },
    {
      label: "ORCID",
      href: "https://orcid.org/0009-0009-8528-9088",
      icon: "orcid",
      username: "0009-0009-8528-9088",
    },
  ],
} as const;

export const EXTERNAL_LINK_ATTRS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

// Homepage sections in page order. `short` is used where space is tight
// (table of contents, mobile menu).
export const sections = [
  { id: "about", title: "About" },
  { id: "publications", title: "Publications" },
  { id: "education", title: "Education" },
  { id: "experience", title: "Experience" },
  { id: "talks", title: "Invited Talks", short: "Talks" },
  { id: "teaching", title: "Teaching and Mentorship", short: "Teaching" },
  { id: "service", title: "Service" },
  { id: "awards", title: "Awards" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionLabel = (section: (typeof sections)[number]) =>
  "short" in section ? section.short : section.title;
