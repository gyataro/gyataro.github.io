export type Period = { start: number; end?: number | "present" };

// "2024 – present", "2019 – 2023", or just "2026" for single-year entries.
export function formatPeriod({ start, end }: Period): string {
  if (end === undefined || end === start) return String(start);
  return `${start} – ${end}`;
}

// Newest first. Collection loaders don't guarantee file order, so CV sections
// are sorted explicitly; ties keep their original relative order.
export function sortByStartDesc<T extends { data: { start: number } }>(
  entries: T[],
): T[] {
  return [...entries].sort((a, b) => b.data.start - a.data.start);
}

// Groups entries by key in order of first appearance, so pre-sorted input
// yields groups ordered by their newest entry, newest first within each group.
export function groupBy<T>(items: readonly T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return [...groups.entries()];
}
