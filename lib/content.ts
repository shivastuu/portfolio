// Single source of truth for everything the site says. Edit here, not in components.
// The "Ask about me" AI answers only from this file and lib/resume.ts (netlify/functions/ask.mts), so keep both accurate.

export const links = {
  email: "shivastuu@gmail.com",
  phone: "+91 7704025456",
  linkedin: "https://www.linkedin.com/in/shivastu-srivastava-811248212",
  github: "https://github.com/shivastuu",
  resume: "/Shivastu_Shrivastava_Resume.pdf",
};

export const hero = {
  eyebrow: "Software Engineer at Niyo — Bangalore",
  status: "Open to product, frontend & mobile roles",
  lede: "Product-minded engineer — React UIs, mobile apps and Python LLM tooling, end to end.",
  rotator: ["payment flows", "KYC journeys", "encrypted SDKs", "LLM agent pipelines", "design systems"],
};

export const marquee = [
  "TypeScript", "React", "Next.js", "React Native", "Flutter", "Python",
  "LangGraph", "Tailwind CSS", "TanStack Query", "Zustand", "WebCrypto", "gRPC-Web",
];

export const domains = [
  "Payments", "KYC onboarding", "Encryption", "Design systems", "Micro-frontends",
  "Offline-first", "Server-driven UI", "Performance", "LLM agents", "AI security",
];

// *wrapped* words render in the accent serif.
export const about =
  "I own features end to end, from React UIs to Python LLM agents. Payments that *fail closed.* KYC that turns *12 backend states* into 6 clear screens. SDKs *78% lighter.*";

export const stats = [
  { from: 0, to: 3, suffix: "", label: "Platforms shipped to production" },
  { from: 0, to: 20, suffix: "", label: "Apps on a design system I made tree-shakeable" },
  { from: 0, to: 78, suffix: "%", label: "Lighter Video KYC SDK" },
  { from: 59.5, to: 0, suffix: "%", label: "LLM attacks landing, down from 59.5%" },
];

// Card copy (big, caption, points, stack) shows on the home roadmap; the rest is the case study at /work/<slug>.
export const projects = [
  {
    slug: "credit-card-app",
    title: "Co-Branded Credit Card",
    kind: "Mobile · Flutter",
    hue: 75,
    big: "Fail-closed",
    caption: "Unconfirmed payments show pending, never failed",
    points: [
      "Flutter plugin running a React PWA over a JS bridge, wired to live bank SDKs.",
      "BBPS bill pay built behind a remote flag, so it can go live without an app release.",
    ],
    stack: ["Flutter", "Kotlin", "BLoC", "Remote Config"],
    role: "Co-built with a teammate. I scaffolded the plugin and built most of the screens after onboarding.",
    status: "Card module live in the app. In-app bill pay is built; its flag is still off.",
    problem:
      "A partner bank's co-branded credit card needed a native home inside the company's super-app, right after users finished onboarding in a React web flow.",
    built: [
      "The Flutter plugin itself: routes, a WebView screen hosting the React onboarding PWA over a JavaScript bridge, an example host app and CI.",
      "A homepage on live bank APIs: balance tile, card widget, quick actions, and its own empty, loading and error state for every section.",
      "Card controls (lock, usage toggles, limits) behind one buffered, MPIN-gated save, plus statements and searchable transaction history.",
      "In-app bill payment (BBPS): bill details, amount validation, and one result screen for success, partial, failed and pending.",
    ],
    hard:
      "A payment the app can't confirm must never read as failed, because a user who sees \"failed\" after a debit may pay again. Every unknown result falls back to \"in process\", and the result screen polls the payment status every 30 seconds, up to 15 times, before settling on pending. The bank's native SDK also crashed on concurrent calls, so homepage requests run one at a time and are cached for every sub-screen.",
    result:
      "The card lives inside the super-app on real bank data. Bill payment sits behind a Remote Config flag, so the in-app flow can be switched on without shipping an app release.",
  },
  {
    slug: "onboarding-pwa",
    title: "Credit Card Onboarding PWA",
    kind: "Web · PWA",
    hue: 262,
    big: "12 → 6",
    caption: "CKYC states → clear screens",
    points: [
      "Empty repo to production; owned the PAN, Video KYC and CKYC flows.",
      "Ops change downtime notices and agent hours from the CMS — no redeploy.",
    ],
    stack: ["React", "TypeScript", "Workbox", "Strapi"],
    role: "Built from an empty repo with one other frontend engineer. I owned the PAN, Video KYC, CKYC, consent and downtime screens.",
    status: "Live in production.",
    problem:
      "People applying for the card had to get through PAN, KYC and consent steps inside a WebView, on whatever phone and network they had, with a backend that reported 12 different KYC statuses.",
    built: [
      "A Vite, React and TypeScript PWA with lazy-loaded routes, Zustand stores and Workbox precaching.",
      "One CKYC router that maps 12 backend statuses to 6 screens users understand, and re-checks status when they come back from the bank's KYC page.",
      "CMS-driven config (Strapi) for downtime notices and Video KYC agent hours. It fails open, so a CMS outage can't block onboarding.",
      "A secured-card offer on the rejection screen, so a rejected applicant gets a next step instead of a dead end.",
      "Sentry error monitoring with no session replay, because replay would record PAN and Aadhaar details.",
    ],
    hard:
      "Four onboarding screens suddenly failed to load for every user. I ruled out a Safari gap and a stale deploy, then probed the CDN directly and found a firewall rule blocking some of the JS chunk names the build generated. Switching the build's content hashes to hex removed the whole class of problem, instead of asking for a firewall exception.",
    result:
      "The hotfix restored every precached file. The new CMS rule engine was checked against a full year of 15-minute timestamps with no change in behaviour from the old one.",
  },
  {
    slug: "design-system",
    title: "Shared Design System",
    kind: "Library · React",
    hue: 45,
    big: "20 apps",
    caption: "Depend on the shared library",
    points: [
      "Built 22 of its 49 components from Figma tokens, in light and dark.",
      "Tree-shakeable build; moved the Video KYC SDK onto it, 2.9 MB → 651 KB.",
    ],
    stack: ["React", "Material UI", "Storybook", "Vite"],
    role: "Main contributor to a co-maintained library: 22 of its 49 components and about 40 releases.",
    status: "In use. About 20 internal apps list it as a dependency.",
    problem:
      "Product teams were rebuilding the same inputs, dialogs and sheets from Figma by hand, and every release of the shared library reached about 20 apps, so one broken export broke other teams.",
    built: [
      "22 components, including an OTP/PIN input, date pickers, a navigation bar with 4 layouts, a dialog that becomes a bottom sheet on phones, bank and UPI logos and file upload.",
      "Figma tokens typed onto the Material UI theme through module augmentation, with light and dark values.",
      "A tree-shakeable Vite library build: preserved modules, explicit exports and side effects limited to CSS.",
      "Per-branch Storybook deploys in CI, and an upgrade from Storybook 8.6 to 10.3.",
      "A 1,200-line adoption guide for other teams, including Next.js App Router setup.",
    ],
    hard:
      "Moving the Video KYC SDK onto the system made its dialogs render 40px too wide on phones. Material UI renders dialogs in a portal on document.body, outside the SDK's scoped CSS baseline, so they lost border-box sizing. A global reset would have leaked styles into the host apps, so I scoped the fix to the dialog and snackbar roots only.",
    result:
      "The Video KYC SDK went from about 2.9 MB (JS and CSS) to 651 KB of JS with no CSS file. Part of that drop is shared code the host app now loads once from the design system.",
  },
  {
    slug: "sdks",
    title: "Auth & Encryption SDKs",
    kind: "Platform · SDKs",
    hue: 168,
    big: "1 call",
    caption: "Login or PAN check in any host app",
    points: [
      "OTP login with HttpOnly sessions and one token refresh shared across tabs.",
      "Top contributor to the E2E-encrypted HTTP SDK; built encrypted telemetry capturing Core Web Vitals.",
    ],
    stack: ["TypeScript", "WebCrypto", "Web Locks", "gRPC-Web"],
    role: "Built the login, PAN and telemetry SDKs; top contributor to the encrypted HTTP SDK.",
    status: "Login and PAN SDKs in use. The email page and the telemetry rebuild are built, not live yet.",
    problem:
      "The forex card and remittance web apps each needed login and PAN verification, and requests had to be end-to-end encrypted.",
    built: [
      "An OTP login SDK: one AuthModal() call mounts the login in any host app. Used by the forex card and remittance web apps.",
      "A PAN verification SDK: format check, consent-based name fetch, an 18+ check and attempt limits, in one openPanModal() call.",
      "Fixes to the encrypted HTTP SDK: empty encrypted responses no longer throw, decrypted error bodies reach callers, and npm advisories went from 24 to 0 at v1.2.0.",
      "A telemetry SDK with AES via WebCrypto, hand-written RSA key wrapping, gRPC-Web framing and an IndexedDB offline queue.",
      "An email-verification page that scores Lighthouse 97 Performance and 100 Accessibility on Slow 4G.",
    ],
    hard:
      "The backend moved sessions to HttpOnly cookies with rotating refresh tokens, where reusing a refresh token revokes the session, so two tabs refreshing at once could log the user out. I made refresh single-flight inside a tab and serialised it across tabs with the Web Locks API, with a safe fallback when locks aren't available, and kept the SDK's public API exactly the same.",
    result:
      "Both apps moved to cookie sessions with an 11-point migration checklist. Tokens are now held in memory, not in script-readable storage.",
  },
  {
    slug: "compliance-workbench",
    title: "Forex Compliance Workbench",
    kind: "Web · Micro-frontends",
    hue: 28,
    big: "Maker–checker",
    caption: "Approvals with gated PII",
    points: [
      "Micro-frontend consoles for customer risk scoring and KYC review.",
      "Permission-gated PII and correlation IDs across the API layer.",
    ],
    stack: ["React", "single-spa", "Redux-Saga", "Tailwind"],
    role: "Built the risk-scoring and KYC review consoles.",
    status: "Internal tool for the compliance team.",
    problem:
      "Compliance teams approve KYC cases and change customer risk rules, and every change needs one person to make it and another to approve it.",
    built: [
      "A risk-scoring console: view and change weights under maker-checker rules, browse approved versions, and re-score customers in bulk from CSV.",
      "KYC review pages with document viewers (image, PDF, video, XML) and identity-match results.",
      "A customer 360 view with permission-gated PII unmasking, PEP review and one transaction search across three products.",
      "A per-domain API layer that adds fresh auth and a correlation ID to every request.",
    ],
    hard:
      "Change requests came back as nested before-and-after configs that no reviewer could read. I flattened them into readable change rows, matching risk bands by flag instead of array position, so a checker sees exactly what they are approving.",
    result:
      "Also closed a review gap: identity-match results showed only face rows, so a case could pass while its PAN face match failed unseen. All match types now show.",
  },
  {
    slug: "react-native-app",
    title: "React Native App",
    kind: "Mobile · React Native",
    hue: 205,
    big: "13",
    caption: "Home sections the product team edits live",
    points: [
      "Server-driven home: 13 CMS sections, reordered without an app release.",
      "Debit card lock, block and limits — every change OTP-verified.",
    ],
    stack: ["Expo", "TanStack Query", "Reanimated", "Zustand"],
    role: "Built the homepage, debit card controls and push notifications in the rebuild from Flutter to React Native.",
    status: "Built and merged. The app hasn't been released yet.",
    problem:
      "The consumer app was being rebuilt in React Native, and the product team wanted to change the homepage without shipping an app release.",
    built: [
      "A server-driven homepage: CMS layouts decide which of 13 sections render, and in what order.",
      "Bundled offline copies of every layout, and a CI test that fails on any broken deeplink. It found 26, now fixed.",
      "Debit card lock, block, channel toggles and limits, each verified with OTP, with a 3-attempt lockout.",
      "Push notifications through FCM and APNs, routed through the app's deeplink registry.",
    ],
    hard:
      "A bad CMS document can break a server-driven screen. Every content read goes through one fetch function with a bundled fallback, and the mappers fail safe, so an unreadable response never downgrades an active user to the first-time view.",
    result: "Merged and tested against the UAT backend. The app itself hasn't been released yet.",
  },
  {
    slug: "redcell",
    title: "RedCell",
    kind: "Side project · AI security",
    hue: 330,
    big: "59.5% → 0%",
    caption: "Attack success after hardening",
    points: [
      "Multi-agent LLM pipeline in LangGraph that red-teams tool-using LLM agents; every breach verified deterministically.",
      "Layered defences + a CI/CD gate: 0% on a 42-attack replay (31% adaptive).",
    ],
    stack: ["Python", "LangGraph", "FastMCP", "Next.js"],
    role: "Solo side project.",
    status: "Side project. All numbers come from its deterministic simulator, not a live model.",
    problem:
      "Tool-using LLM agents in fintech can be talked into leaking data or calling tools they shouldn't. I wanted to measure that, not guess.",
    built: [
      "A LangGraph supervisor that sends attack agents (prompt injection, policy evasion) against a fintech-style agent whose tools sit behind a FastMCP server.",
      "A deterministic verifier that confirms each breach from a server-recorded trace: leaked canaries, unauthorised tool calls, PII and schema checks. No LLM decides what counts as a breach.",
      "Five layers of defences, a frozen corpus of 42 attacks, and a CI gate that fails if a blocked attack gets through again.",
      "A results dashboard in Next.js 15, built entirely from React Server Components.",
    ],
    hard:
      "An LLM judge can be fooled by the same obfuscation the attacks use, so verdicts come from deterministic checks instead. Measured against the verifier, an LLM judge agreed only moderately (Cohen's kappa about 0.68).",
    result:
      "Attack success fell from 59.5% to 0% on the frozen replay, and to 31% under adaptive attack. Structural controls held; probabilistic filters fell to encoding tricks.",
  },
];

export const experience = [
  { when: "Aug 2025 — Now", role: "Software Development Engineer I", org: "Niyo", note: "Cards, forex & partner-bank products — web, React Native, Flutter." },
  { when: "Jan — Jul 2025", role: "Project Trainee", org: "Niyo", note: "Converted to full-time." },
  { when: "2021 — 2025", role: "B.E., Electronics & Communication", org: "Thapar Institute of Engineering & Technology", note: "Patiala, Punjab." },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Dart", "HTML", "CSS"] },
  { group: "Frameworks & tools", items: ["React", "Next.js", "React Native", "Flutter", "Tailwind CSS", "Redux Toolkit", "TanStack Query", "BLoC", "Vite", "Webpack", "Jest", "Vitest", "Sentry", "Firebase", "LangGraph", "Claude API", "CI/CD"] },
  { group: "Concepts", items: ["REST APIs", "LLM agent pipelines", "Auth & session security", "Encryption", "Performance & monitoring", "Micro-frontends", "Design systems", "Server-driven UI", "UI/UX", "Unit testing"] },
];

// Starter questions in the "Ask about me" chat.
export const askSuggestions = [
  "What has Shivastu built at Niyo?",
  "How strong is he in React and Next.js?",
  "What's the hardest problem he has solved?",
];

// Extra context for the "Ask about me" AI only; not shown on the page.
export const aiNotes = [
  "Next.js: App Router, React Server Components, static generation with generateStaticParams, next/font, the Metadata API and serverless functions, used in this portfolio (Next.js 16) and the RedCell dashboard (Next.js 15). He also wrote the shared design system's Next.js App Router integration guide for the apps that consume it.",
  "React: nearly 2 years of production React and TypeScript at Niyo, across an onboarding PWA, embeddable SDKs, a shared design system used by about 20 apps, and micro-frontend consoles.",
];

export const site =
  "This site is built with Next.js 16 (App Router, statically exported to Netlify), GSAP and Lenis for motion, and a light/dark theme. Each project has its own statically generated case-study page.";
