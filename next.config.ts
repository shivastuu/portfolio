import type { NextConfig } from "next";

// Fully static site: `next build` writes plain HTML/JS to out/ for any CDN (Netlify).
const config: NextConfig = { output: "export" };

export default config;
