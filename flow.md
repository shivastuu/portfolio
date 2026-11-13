# Flow

## 2026-10-27 — Portfolio site (personal, no Jira)

```mermaid
flowchart TD
  A["Read resume PDF<br/>+ extract LinkedIn/GitHub links"] --> B["decision.md written"]
  B --> C["npm i next 16.4.3, react 19.3.1,<br/>gsap 3.15, @gsap/react, lenis"]
  C --> D["lib/content.ts, lib/gsap.ts"]
  D --> E["components: Motion, Cursor, Magnetic,<br/>Hero, Marquee, About, Work,<br/>Experience, Contact"]
  E --> F["app/layout, page, globals.css,<br/>icon.svg, next.config (static export),<br/>netlify.toml"]
  F --> G{"npm run build"}
  G -->|"pass, / prerendered static"| H{"Playwright + local Chrome<br/>screenshots: desktop, mobile,<br/>reduced motion"}
  H -->|"4 bugs: card text clipped,<br/>cursor stuck at 0,0, orb text split,<br/>serif descender cut"| I["Fix CSS + Work parallax + Cursor"]
  I --> J{"rebuild + re-shoot"}
  J -->|"clean, 0 console errors"| K["git init, local email = personal gmail<br/>commit"]
  K --> L{"github.com/shivastuu/portfolio exists?"}
  L -->|"404 — no gh CLI to create it"| M["Blocked: user creates empty repo,<br/>then push over HTTPS (keychain creds)"]
```

```mermaid
flowchart TD
  M["User created github.com/shivastuu/portfolio"] --> N["git push --no-verify -u origin main"]
  N --> O{"push result"}
  O -->|"main -> main, tracking set"| P["Pushed. Next: user imports repo in Netlify"]
```

## 2026-10-27 — Punchier copy, roadmap projects, flare cursor, lighter theme

```mermaid
flowchart TD
  A["lib/content.ts<br/>shorter impact-first copy"] --> B["lib/gsap.ts<br/>+ MotionPath, ScrambleText"]
  B --> C["Work.tsx → roadmap<br/>SVG road, traveller dot, milestones"]
  C --> D["Cursor.tsx → canvas lens flare<br/>tail, halo, ghosts, sparks"]
  D --> E["Hero rotator, 2-row Marquee,<br/>Motion: aurora, progress, scramble"]
  E --> F["globals.css rewrite<br/>lighter palette, old rail CSS removed"]
  F --> G{"npm run build"}
  G -->|"pass"| H{"Playwright screenshots<br/>desktop / mobile / reduced"}
  H -->|"mobile: metric overlaps card"| I["Metric parallax desktop-only"]
  I --> J{"re-shoot mobile"}
  J -->|"clean, 0 console errors"| K["Left uncommitted"]
  K --> L{"Reword pushed root commit?"}
  L -->|"force-push blocked by permission classifier"| M["Blocked: user runs reword + commit + push"]
```

## 2026-10-28 — Align portfolio with the product-engineer resume

```mermaid
flowchart TD
  A["lib/content.ts<br/>lede, rotator, marquee, about,<br/>SDK + RedCell bullets, skills"] --> B["app/layout.tsx<br/>title + description"]
  B --> C["public/ resume PDF<br/>→ tailored pdfLaTeX build"]
  C --> D{"npm run build"}
  D -->|"pass"| E{"Playwright: hero + skills"}
  E -->|"clean, 0 console errors"| F["commit + push → Netlify redeploy"]
```

## 2026-11-13 — AI "Ask about me", case studies, light/dark mode

```mermaid
flowchart TD
  A["Read talking-points.md<br/>for honest case-study copy"] --> B["lib/content.ts<br/>slugs + case studies, Design System milestone,<br/>bill-pay copy fixed to 'built'"]
  B --> C["netlify/functions/ask.mts<br/>Gemini via fetch, prompt from content.ts,<br/>input caps + rate limit"]
  C --> D["layout boot script (theme, intro once)<br/>Nav + ThemeToggle + Ask components<br/>Hero, Motion (per-page), Work links"]
  D --> E["app/work/[slug]/page.tsx<br/>generateStaticParams + metadata"]
  E --> F["globals.css<br/>tokens, light palette, case + chat styles"]
  F --> G{"npm run build"}
  G -->|"fail: await in arrow fn"| H["generateMetadata fix"]
  H --> G2{"npm run build"}
  G2 -->|"pass, 7 SSG case pages"| I{"esbuild bundle + mocked-fetch<br/>checks on the function"}
  I -->|"all pass: 405/503/400/429/502,<br/>caps, thought parts dropped"| J{"Playwright + Chrome:<br/>both themes, mobile, chat stub"}
  J -->|"Ask button covers scroll cue + footer"| K["--fab-room padding on hero + contact"]
  J -->|"arrow overlaps case bullets"| L["case bullets padding 1.6em"]
  K --> M{"rebuild + re-shoot"}
  L --> M
  M -->|"clean; only stubbed 429 errors"| N["Left uncommitted:<br/>needs GEMINI_API_KEY in Netlify"]
```

## 2026-11-13 — Chat answers from the full resume

```mermaid
flowchart TD
  A["lib/resume.ts<br/>text from the public resume PDF"] --> B["ask.mts: resume in prompt,<br/>fit-question + no-model rules"]
  B --> C["content.ts: 3 starter questions,<br/>site fact without model name<br/>Ask.tsx: greeting + subtitle"]
  C --> D{"npm run build"}
  D -->|"pass"| E{"function checks +<br/>no 'gemini' in client build"}
  E -->|"all pass, ~4.5k-token prompt"| F["commit + push → Netlify deploy"]
```

## 2026-11-13 — Live-site fixes

```mermaid
flowchart TD
  A{"Live checks:<br/>curl /api/ask + Chrome"} -->|"API 200 with key set;<br/>data-theme missing"| B["Found Netlify head comment<br/>→ hydration error #418"]
  B --> C["lib/boot.ts shared by inline script<br/>+ components/Boot.tsx layout effect"]
  C --> D["Ask.tsx: icon button, bubble,<br/>'Something went wrong' copy<br/>globals.css: warmer light theme"]
  D --> E["content.ts aiNotes + ask.mts<br/>positive-framing rules"]
  E --> F{"build + function checks"}
  F -->|"pass"| G{"Chrome against a local server<br/>that injects the same comment"}
  G -->|"theme kept, 1 icon, preloader plays,<br/>toggle works"| H["commit + push"]
```

## 2026-11-13 — Calmer cursor; contact in chat

```mermaid
flowchart TD
  A["Cursor.tsx rewrite: dot + click sparks only<br/>globals.css: .sparks, 8px dot, 40px ring"] --> B["content.ts links.phone, resume.ts phone,<br/>ask.mts hiring rule, Ask.tsx mailto/tel links"]
  B --> C{"build + function checks"}
  C -->|"pass"| D{"Chrome: move, hover, click, chat stub"}
  D -->|"canvas clears after burst,<br/>mailto + tel links, 0 errors"| E["commit + push"]
```

## 2026-11-13 — Cursor ring, ownership copy, share card, stats

```mermaid
flowchart TD
  A["Cursor.tsx ring + stretch, globals.css hover states"] --> B["content.ts about + stat, links.site<br/>ask.mts retry on 5xx"]
  B --> C["opengraph-image.tsx, sitemap.ts, robots.ts,<br/>layout metadata, case-page og:image,<br/>netlify.toml PNG header"]
  C --> D{"build + function checks"}
  D -->|"pass; og tags on all pages"| E{"Chrome: ring moving/hover,<br/>about section, share card"}
  E -->|"clean, 0 errors"| F["commit + push"]
```

## 2026-11-13 — Stronger resume + site

```mermaid
flowchart TD
  A["resume-main.tex: ownership + live wording,<br/>new wins (outage, Lighthouse, 24→0, activation)"] --> B{"pdfLaTeX"}
  B -->|"2 pages"| C["trim summary, skills, 2 bullets"]
  C --> B2{"pdfLaTeX"}
  B2 -->|"1 page"| D["PDF → public/, lib/resume.ts text"]
  D --> E["content.ts: lede, stats, roles, statuses,<br/>experience notes; Nav résumé link"]
  E --> F{"build + function checks"}
  F -->|"pass (stale test phrase updated)"| G["commit + push"]
```

## 2026-11-13 — Prepare a move to Cloudflare Pages

```mermaid
flowchart TD
  A["git checkout -b cloudflare"] --> B["lib/ask.ts (shared logic)<br/>netlify/functions/ask.mts + functions/api/ask.ts<br/>public/_headers"]
  B --> C{"npm run build"}
  C -->|"TS2559 on process.env"| D["Env = Record of strings"]
  D --> C2{"npm run build"}
  C2 -->|"pass, out/_headers present"| E{"Netlify + Cloudflare entry checks"}
  E -->|"all pass"| F["push branch 'cloudflare' (0 credits)"]
```
