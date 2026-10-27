export interface Dated {
  data: { date: Date };
}

export interface AuthorOptions {
  me: string;
  cofirst?: boolean;
  corresponding?: boolean;
}

export interface Author {
  name: string;
  isMe: boolean;
  // "*" marks co-first authors, "#" marks me as corresponding author.
  marker: string;
}

export function sortByDateDesc<T extends Dated>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

// Groups entries by calendar year, newest year first, preserving input order
// within each year.
export function groupByYear<T extends Dated>(entries: T[]): [number, T[]][] {
  const byYear = new Map<number, T[]>();
  for (const entry of entries) {
    const year = entry.data.date.getUTCFullYear();
    const group = byYear.get(year) ?? [];
    group.push(entry);
    byYear.set(year, group);
  }
  return [...byYear.entries()].sort(([a], [b]) => b - a);
}

export function formatAuthors(
  authors: readonly string[],
  { me, cofirst = false, corresponding = false }: AuthorOptions,
): Author[] {
  return authors.map((name, i) => {
    const isMe = name.toLowerCase() === me.toLowerCase();
    const marker =
      (cofirst && i < 2 ? "*" : "") + (isMe && corresponding ? "#" : "");
    return { name, isMe, marker };
  });
}

// "USENIX Security 2025"; preprints get no venue label.
export function venueLabel(venue: string, date: Date): string | undefined {
  const normalized = venue.trim().toLowerCase();
  if (!normalized || normalized === "preprint" || normalized === "arxiv") {
    return undefined;
  }
  return `${venue.trim()} ${date.getUTCFullYear()}`;
}
