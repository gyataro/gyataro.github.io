# xiwen.me

Personal academic website for Xiwen Teoh, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). Deployed to GitHub Pages at [xiwen.me](https://xiwen.me).

The whole site is a single page, so the content for name searches (bio, publications, awards) all sits on `/`. The old `/publications` and `/awards` URLs redirect to the matching sections.

## Stack

- **Astro 7** (static output) with content collections for publications and awards
- **Tailwind CSS v4** (CSS-native theme tokens in `src/styles/global.css`, light/dark via `data-theme`)
- **Astro Fonts API** serving self-hosted Inter and Newsreader
- **TypeScript** in strict mode, ESLint + Prettier, Vitest, Husky + lint-staged
- **pnpm** as package manager, Node ≥ 22.23.4

## Project structure

```
src/
  assets/              # source images (optimized at build time via astro:assets)
  components/
    layout/            # Navbar (with mobile menu), TableOfContents, Footer
    seo/               # <head> meta tags and JSON-LD
    ui/                # ThemeToggle
    Publication.astro  # one publication entry
    CvEntry.astro      # one dated row (education, awards, ...)
    Section.astro      # page section with anchored heading
  config/site.ts       # name, links, affiliation, SEO copy, section list
  content/
    awards/            # one markdown file per award
    cv/                # education, experience, talks, teaching, service (YAML; shown newest first)
    publications/      # one markdown file per publication
  content.config.ts    # zod schemas for the content collections
  layouts/BaseLayout.astro
  pages/               # index, 404, robots.txt
  styles/global.css
  utils/               # publication/period helpers (+ tests) and the JSON-LD builder
public/                # favicon, CV PDF (linked from the header)
```

To add a publication or award, add a markdown file to the matching folder under `src/content/`. The page, sitemap and structured data update on the next build.

## Commands

| Command          | Action                                     |
| :--------------- | :----------------------------------------- |
| `pnpm install`   | Install dependencies                       |
| `pnpm dev`       | Start local dev server at `localhost:4321` |
| `pnpm build`     | Build the production site to `./dist/`     |
| `pnpm preview`   | Preview the build locally                  |
| `pnpm check`     | Run Astro type-checking                    |
| `pnpm typecheck` | Run `tsc --noEmit`                         |
| `pnpm lint`      | Run ESLint                                 |
| `pnpm format`    | Format with Prettier                       |
| `pnpm test`      | Run unit tests                             |

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which type-checks, lints, tests, builds, and deploys to GitHub Pages.

## Credits

Tooling and parts of the layout, SEO and theme components are adapted from [Astro Starter Pro](https://github.com/devgelo-labs/astro-starter-pro), MIT License, Copyright (c) 2026 Angelo Pescetto | Devgelo.
