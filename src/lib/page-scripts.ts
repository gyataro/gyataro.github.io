/**
 * Astro's ClientRouter dedupes identical inline `<script>` content across
 * view-transition navigations, so a page-specific script only ever runs
 * once. Register initialization via `astro:page-load` instead — it fires
 * on the initial load and again after every navigation — but because that
 * listener then persists on `document` for the rest of the browsing
 * session, it will also fire on unrelated pages that don't have the
 * expected elements. This helper bails out safely in that case instead of
 * throwing, so every page script gets the correct behavior by construction.
 */
export function onPageReady<K extends string>(
  ids: Record<K, string>,
  callback: (els: Record<K, HTMLElement>) => void
) {
  document.addEventListener('astro:page-load', () => {
    const found = {} as Record<K, HTMLElement>
    for (const key in ids) {
      const el = document.getElementById(ids[key])
      if (!el) return
      found[key] = el
    }
    callback(found)
  })
}
