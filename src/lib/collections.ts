import { getCollection, type CollectionEntry } from 'astro:content'

export function groupByYear<T>(items: T[], getYear: (item: T) => number): Map<number, T[]> {
  const byYear = new Map<number, T[]>()
  for (const item of items) {
    const year = getYear(item)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(item)
  }
  return byYear
}

export async function getSortedPublications(): Promise<CollectionEntry<'publications'>[]> {
  const publications = await getCollection('publications')
  return publications.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getSortedAwards(): Promise<CollectionEntry<'awards'>[]> {
  const awards = await getCollection('awards')
  return awards.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
