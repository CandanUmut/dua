import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://candanumut.github.io",
  base: "/dua",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
  compressHTML: true,
  devToolbar: { enabled: false },
});
