# xiwen.me

Personal portfolio site for Xiwen Teoh, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). Deployed to GitHub Pages at [xiwen.me](https://xiwen.me).

## Stack

- **Astro 7** (static output) with content collections for publications and awards
- **Tailwind CSS v4** (config-free, CSS-native theme in `src/styles/global.css`)
- **TypeScript** in strict mode
- **pnpm** as package manager, Node 22 (see `.nvmrc`)

## Project structure

```
src/
  assets/            # source images (optimized at build time via astro:assets)
  components/        # Astro components, including icons/
  content/
    awards/          # one markdown file per award
    publications/    # one markdown file per publication
  content.config.ts  # zod schemas for the content collections
  consts.ts          # site-wide constants, SEO meta, JSON-LD schema builders
  lib/                # shared helpers (collection queries, page-script utilities)
  layouts/BaseLayout.astro
  pages/             # index, publications, awards, 404
  styles/global.css  # Tailwind import + theme tokens
public/              # favicon, robots.txt
```

## Commands

All commands are run from the root of the project:

| Command        | Action                                       |
| :------------- | :-------------------------------------------- |
| `pnpm install` | Install dependencies                          |
| `pnpm dev`     | Start local dev server at `localhost:4321`    |
| `pnpm build`   | Build the production site to `./dist/`        |
| `pnpm preview` | Preview the build locally before deploying    |
| `pnpm check`   | Run Astro/TypeScript type-checking            |
| `pnpm lint`    | Run ESLint                                    |

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which type-checks, lints, builds, and deploys to GitHub Pages.
