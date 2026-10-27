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
  content/schemas.ts   # zod schemas, shared by the site and the CV generator
  content.config.ts    # content collections
  layouts/BaseLayout.astro
  pages/               # index, 404, robots.txt
  styles/global.css
  utils/               # publication/period helpers, JSON-LD builder, RenderCV mapping (+ tests)
scripts/build-cv.ts    # generates the CV PDF from src/content/
cv/                    # RenderCV project: design, locale, settings (uv, Python 3.14)
public/                # favicon; the CV PDF is generated here (not committed)
```

To add a publication or award, add a markdown file to the matching folder under `src/content/`. The page, sitemap and structured data update on the next build.

## Commands

| Command          | Action                                                                    |
| :--------------- | :------------------------------------------------------------------------ |
| `pnpm install`   | Install dependencies                                                      |
| `pnpm dev`       | Start local dev server at `localhost:4321`                                |
| `pnpm build`     | Build the production site to `./dist/`                                    |
| `pnpm preview`   | Preview the build locally                                                 |
| `pnpm check`     | Run Astro type-checking                                                   |
| `pnpm typecheck` | Run `tsc --noEmit`                                                        |
| `pnpm lint`      | Run ESLint                                                                |
| `pnpm format`    | Format with Prettier                                                      |
| `pnpm test`      | Run unit tests                                                            |
| `pnpm cv`        | Build `public/Xiwen_Teoh_CV.pdf` (needs [uv](https://docs.astral.sh/uv/)) |

## CV

The CV PDF is generated from the same content as the website, so the two stay in sync:

1. `scripts/build-cv.ts` loads `src/content/` with the site's schemas and writes RenderCV input to `cv/build/`.
2. [RenderCV](https://rendercv.com) renders it with the layout in `cv/design.yaml`, `cv/locale.yaml` and `cv/settings.yaml`.
3. The PDF lands in `public/`, so the site links to it. CI rebuilds it on every deploy.

Edit content in `src/content/` only. To make the CV differ from the website for one entry, add a `cv:` block to it:

```yaml
cv:
  selected: true # publications: list under "Selected Publications"
  hidden: true # leave this entry off the CV
  highlights: [...] # any other key is a RenderCV field that replaces the generated one
  summary: null # null removes a generated field
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which type-checks, lints, tests, builds the CV and the site, and deploys to GitHub Pages.

## Credits

Tooling and parts of the layout, SEO and theme components are adapted from [Astro Starter Pro](https://github.com/devgelo-labs/astro-starter-pro), MIT License, Copyright (c) 2026 Angelo Pescetto | Devgelo.
