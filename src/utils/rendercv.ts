// Builds the `cv:` part of RenderCV's input from the site's content, so the
// website and the CV PDF come from one source. Layout lives in cv/*.yaml.
// Relative .ts imports keep this loadable by plain Node (scripts/build-cv.ts).
import { siteConfig } from "../config/site.ts";
import type {
  Award,
  CvOverride,
  Education,
  Publication,
  Role,
  Service,
  Talk,
} from "../content/schemas.ts";
import { groupBy, sortByStartDesc, type Period } from "./period.ts";
import { formatAuthors, sortByDateDesc } from "./publications.ts";

export interface CvContent {
  publications: Publication[];
  awards: Award[];
  education: Education[];
  experience: Role[];
  talks: Talk[];
  teaching: Role[];
  service: Service[];
}

type Entry = Record<string, unknown>;

// RenderCV takes either a single `date` or a `start_date`/`end_date` range.
export function periodFields({ start, end }: Period): Entry {
  return end === undefined || end === start
    ? { date: start }
    : { start_date: start, end_date: end };
}

// Applies an entry's `cv:` overrides. Directives are consumed elsewhere; a
// null value removes the generated field. Returns undefined for hidden
// entries.
export function applyOverride(
  entry: Entry,
  override: CvOverride,
): Entry | undefined {
  if (!override) return entry;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hidden, selected, ...fields } = override;
  if (hidden) return undefined;
  const merged: Entry = { ...entry, ...fields };
  for (const [key, value] of Object.entries(merged)) {
    if (value === null || value === undefined) delete merged[key];
  }
  return merged;
}

// Typst markup: underline me, superscript markers ("‡" co-first, "#"
// corresponding, escaped because "#" starts Typst code).
export function cvAuthors(publication: Publication): string[] {
  const markers: Record<string, string> = { "*": "‡", "#": "\\#" };
  return formatAuthors(publication.authors, {
    me: publication.me ?? siteConfig.name,
    cofirst: publication.cofirst,
    corresponding: publication.corresponding,
  }).map(({ name, isMe, marker }) => {
    const text = isMe ? `#underline(offset: 2pt)[${name}]` : name;
    const sup = [...marker].map((m) => markers[m]).join("");
    return sup ? `${text}#super[${sup}]` : text;
  });
}

function compact(entries: (Entry | undefined)[]): Entry[] {
  return entries.filter((entry): entry is Entry => entry !== undefined);
}

function publicationEntry(publication: Publication): Entry | undefined {
  return applyOverride(
    {
      title: publication.title,
      authors: cvAuthors(publication),
      journal: publication.venueFull ?? publication.venue,
      date: publication.date.getUTCFullYear(),
    },
    publication.cv,
  );
}

export function buildCv(content: CvContent) {
  const publications = sortByDateDesc(
    content.publications.map((data) => ({ data })),
  ).map(({ data }) => data);
  const awards = sortByDateDesc(content.awards.map((data) => ({ data })));
  const sorted = <T extends { start: number }>(items: T[]) =>
    sortByStartDesc(items.map((data) => ({ data }))).map(({ data }) => data);

  const roleEntry = (role: Role) =>
    applyOverride(
      {
        name: role.role,
        summary: role.organization,
        ...periodFields(role),
        highlights: role.details,
      },
      role.cv,
    );

  // Section order and titles follow the CV, not the website.
  const sections: Record<string, Entry[]> = {
    Education: compact(
      sorted(content.education).map((e) =>
        applyOverride(
          {
            institution: e.institution,
            area: e.field,
            degree: e.degree,
            start_date: e.start,
            end_date: e.end ?? e.start,
            highlights: e.details,
          },
          e.cv,
        ),
      ),
    ),
    Experience: compact(
      sorted(content.experience).map((r) =>
        applyOverride(
          {
            company: r.organization,
            position: r.role,
            start_date: r.start,
            end_date: r.end ?? r.start,
            highlights: r.details,
          },
          r.cv,
        ),
      ),
    ),
    "Selected Publications": compact(
      publications.filter((p) => p.cv?.selected).map(publicationEntry),
    ),
    Publications: compact(
      publications.filter((p) => !p.cv?.selected).map(publicationEntry),
    ),
    "Invited Talks": compact(
      [...content.talks]
        .sort((a, b) => b.year - a.year)
        .map((t) =>
          applyOverride(
            { name: t.title, summary: t.event, date: t.year },
            t.cv,
          ),
        ),
    ),
    // Same-role entries sit together, as on the website.
    Service: compact(
      groupBy(sorted(content.service), (s) => s.role)
        .flatMap(([, entries]) => entries)
        .map((s) =>
          applyOverride(
            { name: s.role, summary: s.venue, ...periodFields(s) },
            s.cv,
          ),
        ),
    ),
    "Teaching and Mentorship": compact(sorted(content.teaching).map(roleEntry)),
    Awards: compact(
      awards.map(({ data }) =>
        applyOverride(
          {
            name: data.title,
            summary: data.source,
            date: data.date.getUTCFullYear(),
          },
          data.cv,
        ),
      ),
    ),
  };

  // Drop undefined fields so the YAML stays clean.
  const clean = (entry: Entry) =>
    Object.fromEntries(
      Object.entries(entry).filter(([, value]) => value !== undefined),
    );

  return {
    cv: {
      name: siteConfig.name,
      email: siteConfig.email,
      website: `${siteConfig.url}/`,
      social_networks: siteConfig.socialLinks.map(({ label, username }) => ({
        network: label,
        username,
      })),
      sections: Object.fromEntries(
        Object.entries(sections)
          .filter(([, entries]) => entries.length > 0)
          .map(([title, entries]) => [title, entries.map(clean)]),
      ),
    },
  };
}
