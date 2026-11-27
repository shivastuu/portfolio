import type { NextConfig } from "next";

// Fully static site: `next build` writes plain HTML/JS to out/ for any CDN (Netlify).
// inlineCss: the stylesheet ships inside each HTML page, so first paint doesn't wait for a separate CSS request.
const config: NextConfig = { output: "export", experimental: { inlineCss: true } };

export default config;
