import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://xiwen.me",
  // The site used to have separate pages; keep their old URLs (and any links
  // or search results pointing at them) resolving to the matching section.
  redirects: {
    "/publications": "/#publications",
    "/awards": "/#awards",
  },
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      // Static weights, not the variable font: Regular alone (23 KB) is what
      // body text waits for, while the variable file is 73 KB.
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      // The fallback is defined in global.css ("Inter Fallback") so it can
      // also match Liberation Sans on Linux; Astro's only tries Arial.
      fallbacks: [],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      // Headings only use semibold.
      weights: [600],
      styles: ["normal"],
      subsets: ["latin"],
    },
  ],
  build: {
    inlineStylesheets: "always",
  },
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
