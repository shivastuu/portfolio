import type { MetadataRoute } from "next";
import { links, projects } from "../lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: links.site }, ...projects.map((p) => ({ url: `${links.site}/work/${p.slug}` }))];
}
