// Cloudflare Pages entry for the "Ask about me" chat (POST /api/ask); the logic lives in lib/ask.ts.
// Set GEMINI_API_KEY (and optionally GEMINI_MODEL) in the Pages project's environment variables.
import { ask } from "../../lib/ask";

export const onRequestPost = ({ request, env }: { request: Request; env: { GEMINI_API_KEY?: string; GEMINI_MODEL?: string } }) => ask(request, env);
