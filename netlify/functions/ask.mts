// Netlify entry for the "Ask about me" chat; the logic lives in lib/ask.ts (shared with functions/api/ask.ts).
import { ask } from "../../lib/ask";

export default (req: Request) => ask(req, process.env);

export const config = {
  path: "/api/ask",
  // Netlify answers 429 past 10 questions a minute per visitor; protects the free-tier quota.
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
