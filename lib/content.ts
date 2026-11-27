// Single source of truth for everything the site says. Edit here, not in components.
// The "Ask about me" AI answers only from this file and lib/resume.ts (netlify/functions/ask.mts), so keep both accurate.

export const links = {
  site: "https://shivastuu.netlify.app",
  email: "shivastuu@gmail.com",
  linkedin: "https://www.linkedin.com/in/shivastu-srivastava-811248212",
  github: "https://github.com/shivastuu",
};

export const hero = {
  eyebrow: "Software Engineer at Niyo — Bangalore",
  status: "Open to product, frontend & mobile roles",
  role: "Software engineer · Bangalore",
  lede: "I build and own fintech products end to end: React & Next.js on the web, Flutter & React Native on mobile.",
  // Lock-screen notifications on the hero phone. Each one is a real result from the projects below.
  notes: [
    { app: "Moksha UI", text: "Prism colour picker shipped: real optics", when: "now", icon: "mk", href: "#moksha" },
    { app: "Design system", text: "Release shipped to 20 apps", when: "1h ago", icon: "ds", href: "/work/design-system" },
    { app: "RedCell", text: "Attack success 83% → 0% with guardrails", when: "2h ago", icon: "rc", href: "/work/redcell" },
    { app: "Storybook", text: "Your fix was merged upstream", when: "1d ago", icon: "sb", href: "#open-source" },
  ],
};

// The featured piece, shown right after the hero: his open-source design system and its prism colour picker.
export const moksha = {
  name: "Moksha UI",
  line: "One design system for React and React Native.",
  pitch:
    "Pick a brand colour from real light. A torch beam splits through a 3D glass prism, every wavelength bent by Snell's law, and the colour you catch re-themes the whole design system, kept at WCAG AA contrast.",
  facts: [
    { k: "One API", v: "The same component renders a real <button> on the web and Pressable on iOS and Android." },
    { k: "One line", v: "createTheme({ brandColor }) builds a 10-step OKLCH scale and light and dark tokens at WCAG AA." },
    { k: "Real optics", v: "Snell's law per wavelength and Fresnel reflections, drawn with three.js." },
  ],
  github: "https://github.com/shivastuu/moksha-ui",
  npm: "https://www.npmjs.com/package/@moksha-ui/core",
  install: "npm i @moksha-ui/core @moksha-ui/tokens",
  // Brand colours to start from; the prism picks any other.
  swatches: [
    { name: "Emerald", hex: "#0E9F7A" },
    { name: "Cobalt", hex: "#1D3A8A" },
    { name: "Gold", hex: "#D4A24C" },
    { name: "Signal red", hex: "#C83223" },
    { name: "Walnut", hex: "#7B4A2A" },
    { name: "Graphite", hex: "#18181B" },
  ],
};

// What I do: the stepped rows under About.
export const services = [
  { title: "Frontend", note: "React, Next.js, TypeScript, performance." },
  { title: "Mobile", note: "Flutter, React Native, server-driven UI." },
  { title: "SDKs & auth", note: "Embeddable SDKs, sessions, WebCrypto." },
  { title: "Design systems", note: "Tokens, components, Storybook, 20 apps." },
  { title: "AI agents", note: "LangGraph, MCP, red-teaming, guardrails." },
];

// Runs as the ticker under the hero.
export const marquee = [
  "TypeScript", "React", "Next.js", "React Native", "Flutter", "Python",
  "LangGraph", "Tailwind CSS", "TanStack Query", "Zustand", "WebCrypto", "gRPC-Web",
];

// *wrapped* words render at full contrast; the rest of the sentence sits in the muted tone.
export const about =
  "I own features end to end, from *architecture* to *production monitoring.* A *credit card module* in Flutter. *KYC onboarding* in production. Embeddable *SDKs.* A *design system* 20 apps depend on.";

export const stats = [
  { to: 8, suffix: "+", label: "Products & SDKs built at Niyo" },
  { to: 20, suffix: "", label: "Apps on the design system I own" },
  { to: 78, suffix: "%", label: "Lighter Video KYC SDK" },
  { to: 97, suffix: "", label: "Lighthouse performance on Slow 4G, with 100 accessibility" },
];

export const projects = [
  {
    slug: "credit-card-app",
    flow: ["Super-app (Flutter)", "Card plugin", "React PWA over a JS bridge", "Bank APIs", "Remote Config flags"], // the case study's "how it fits together" diagram
    color: "#1d3a8a", // sapphire; panel colour on the home page and case study
    on: "#ffffff", // text colour on that panel
    title: "Co-Branded Credit Card",
    kind: "Mobile · Flutter",
    big: "End to end",
    caption: "From an empty Flutter plugin to a live card module",
    points: [
      "Set up the Flutter plugin and co-built the card module end to end on live bank APIs.",
      "In-app bill payment with status tracking that prevents duplicate payments.",
      "Rebuilt card activation when the bank retired its activation API.",
    ],
    stack: ["Flutter", "Dart", "Kotlin", "BLoC", "GetX", "Remote Config"],
    role: "Co-built with one teammate. I scaffolded the Flutter plugin and owned most of the card module after onboarding, from bank API integration to host-app release.",
    status: "Live in the app, including in-app bill payment.",
    problem:
      "A partner bank's co-branded credit card needed a native home inside the company's super-app, right after users finished onboarding in a React web flow.",
    built: [
      "The Flutter plugin itself: routes, a WebView screen hosting the React onboarding PWA over a JavaScript bridge, an example host app and CI.",
      "A homepage on live bank APIs: balance tile, card widget, quick actions, and its own empty, loading and error state for every section.",
      "Card controls (lock, usage toggles, limits) behind one buffered, MPIN-gated save, plus statements and searchable transaction history.",
      "Card activation rebuilt around PIN setup when the bank retired its activation API, and a smoother transaction list with rebuilds scoped per tab.",
      "In-app bill payment (BBPS): bill details, amount validation, and one result screen for success, partial, failed and pending.",
    ],
    hard:
      "A payment the app can't confirm must never read as failed, because a user who sees \"failed\" after a debit may pay again. Every unknown result falls back to \"in process\", and the result screen polls the payment status every 30 seconds, up to 15 times, before settling on pending. The bank's native SDK also crashed on concurrent calls, so homepage requests run one at a time and are cached for every sub-screen.",
    result:
      "The card lives inside the super-app on real bank data, and in-app bill payment went live through a Remote Config flag, without shipping an app release.",
  },
  {
    slug: "onboarding-pwa",
    flow: ["WebView", "PAN check", "Video KYC", "CKYC router: 12 states → 6 screens", "Consent", "Card offer"],
    color: "#d4a24c", // gold
    on: "#111111",
    title: "Credit Card Onboarding PWA",
    kind: "Web · PWA",
    big: "12 → 6",
    caption: "CKYC states → clear screens",
    points: [
      "Led it from an empty repo to production; owned the PAN, Video KYC and CKYC flows.",
      "Fixed a production outage that stopped key screens loading, and a KYC redirect loop.",
      "Turned rejection into a secured-card offer; ops edit content from the CMS, no redeploy.",
    ],
    stack: ["React", "TypeScript", "Workbox", "Strapi"],
    role: "Led it from an empty repo to production, working with one other frontend engineer. I owned the PAN, Video KYC, CKYC, consent and downtime screens.",
    status: "Live in production.",
    problem:
      "People applying for the card had to get through PAN, KYC and consent steps inside a WebView, on whatever phone and network they had, with a backend that reported 12 different KYC statuses.",
    built: [
      "A Vite, React and TypeScript PWA with lazy-loaded routes, Zustand stores and Workbox precaching.",
      "One CKYC router that maps 12 backend statuses to 6 screens users understand, and re-checks status when they come back from the bank's KYC page.",
      "CMS-driven config (Strapi) for downtime notices and Video KYC agent hours. It fails open, so a CMS outage can't block onboarding.",
      "A secured-card offer on the rejection screen, so a rejected applicant gets a next step instead of a dead end.",
      "Sentry error monitoring with no session replay, because replay would record PAN and Aadhaar details.",
      "A fix for a KYC redirect loop that left users stuck between the bank's page and the app.",
    ],
    hard:
      "Four onboarding screens suddenly failed to load for every user. I ruled out a Safari gap and a stale deploy, then probed the CDN directly and found a firewall rule blocking some of the JS chunk names the build generated. Switching the build's content hashes to hex removed the whole class of problem, instead of asking for a firewall exception.",
    result:
      "The hotfix restored every precached file. The new CMS rule engine was checked against a full year of 15-minute timestamps with no change in behaviour from the old one.",
  },
  {
    slug: "design-system",
    flow: ["Figma tokens", "Typed MUI theme", "49 components", "Storybook previews in CI", "Tree-shakeable build", "20 apps"],
    color: "#e9dcc6", // champagne
    on: "#111111",
    title: "Shared Design System",
    kind: "Library · React",
    big: "20 apps",
    caption: "Depend on the shared library",
    points: [
      "Own the shared React design system used by 20 internal apps.",
      "Built 22 of its 49 components from Figma; review and merge other contributors' code.",
      "Made it tree-shakeable: the Video KYC SDK went 78% lighter. Storybook previews in CI.",
    ],
    stack: ["React", "Material UI", "Storybook", "Vite"],
    role: "Owner. I built 22 of its 49 components, shipped about 40 releases, and review and merge other contributors' work.",
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
    flow: ["Host app", "AuthModal() / openPanModal()", "OTP + HttpOnly cookie session", "Single-flight refresh (Web Locks)", "Encrypted HTTP client", "APIs"],
    color: "#c9ccd1", // platinum
    on: "#111111",
    title: "Auth & Encryption SDKs",
    kind: "Platform · SDKs",
    big: "1 call",
    caption: "Login or PAN check in any host app",
    points: [
      "Embeddable OTP login and PAN verification SDKs: any host app integrates with one call.",
      "Secure sessions across browser tabs, with one shared token refresh.",
      "Top contributor to the end-to-end encrypted HTTP client: per-domain keys and bug fixes.",
    ],
    stack: ["TypeScript", "WebCrypto", "Web Locks", "gRPC-Web"],
    role: "Owned and developed the login, PAN and telemetry SDKs; top contributor to the encrypted HTTP SDK.",
    status: "Login and PAN SDKs and the email-verification page are live.",
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
    flow: ["Maker edits rules", "Change request", "Readable change rows", "Checker approves", "New version", "Bulk re-score"],
    color: "#0e6b4f", // emerald
    on: "#ffffff",
    title: "Forex Compliance Workbench",
    kind: "Web · Micro-frontends",
    big: "Maker–checker",
    caption: "Approvals with gated PII",
    points: [
      "Data-heavy admin consoles: customer 360 view and KYC review with maker-checker approvals.",
      "Restructured the API layer into domain services with consistent auth and request tracing.",
      "Combined separate transaction tables into one unified search.",
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
      "Separate transaction tables combined into one unified search.",
    ],
    hard:
      "Change requests came back as nested before-and-after configs that no reviewer could read. I flattened them into readable change rows, matching risk bands by flag instead of array position, so a checker sees exactly what they are approving.",
    result:
      "Also closed a review gap: identity-match results showed only face rows, so a case could pass while its PAN face match failed unseen. All match types now show.",
  },
  {
    slug: "react-native-app",
    flow: ["CMS layout", "One fetch + bundled fallback", "Fail-safe mappers", "13 section renderers", "Home screen"],
    color: "#7b4a2a", // cognac
    on: "#ffffff",
    title: "React Native App",
    kind: "Mobile · React Native",
    big: "13",
    caption: "Home sections the product team edits live",
    points: [
      "Server-driven home screen that updates from the CMS without an app release.",
      "13 CMS sections the product team can reorder live.",
      "Debit card lock, block and limits, every change verified with OTP.",
    ],
    stack: ["Expo", "TanStack Query", "Reanimated", "Zustand"],
    role: "Built the homepage, debit card controls and push notifications in the rebuild from Flutter to React Native.",
    status: "Released.",
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
    result: "Live in the released app: homepage content and section order change from the CMS without an app release.",
  },
  {
    slug: "redcell",
    flow: ["189 published attacks", "Real MCP servers", "Agent under test", "Guardrails", "Deterministic verifier", "Leaderboard"],
    color: "#c83223", // signal red
    on: "#ffffff",
    title: "RedCell",
    kind: "Side project · AI security",
    big: "83% → 0%",
    caption: "Static attacks that got through on a 7B agent, without vs with guardrails",
    points: [
      "Open-source tool that attacks real AI agents through MCP servers: 189 published attacks.",
      "Its guardrails cut a 7B agent's attack success from 83% to 0%, with no lost answers.",
      "An adaptive attacker still got in 10 of 27 times; moving a system-prompt secret out made it 0.",
    ],
    stack: ["Python", "MCP", "Claude API", "Next.js"],
    repo: "https://github.com/shivastuu/redcell",
    role: "Solo side project.",
    status: "Side project. Every number comes from real model runs, reported with its sample size and confidence interval.",
    problem:
      "AI agents that can call tools can be talked into leaking data or doing things they shouldn't. I wanted to measure how often, and what actually stops it, instead of guessing.",
    built: [
      "A harness that attacks real agents through real MCP servers: 9 attack goals × 7 published attack styles per agent, sent by the user, hidden in data the agent reads, or hidden in a poisoned tool description.",
      "A deterministic verifier that decides every breach from what the MCP server recorded: leaked secrets (even encoded), forbidden tool calls, card numbers, auto-loading images. No LLM decides what counts.",
      "Five real guardrails (Protect AI's injection classifier, datamarking, a tool allowlist, withholding confidential fields plus Presidio, and render-safe output), each measured on attack success, false alarms, useful answers and latency.",
      "An adaptive attacker that reads the agent's refusal and rewrites the attack, a live leaderboard, and a cross-check on the official AgentDojo benchmark.",
    ],
    hard:
      "A defense that looks perfect on fixed attacks can still fail. The guardrails stopped every static attack on the 7B agent, but an adaptive attacker got through 10 of 27 times, each time by leaking a secret written in the system prompt, which no filter can protect.",
    result:
      "Guardrails cut the 7B agent's attack success from 83% to 0% with no lost answers or false alarms on normal questions. Moving the secret out of the prompt took adaptive attacks from 10 of 27 to 0. Claude Haiku held at 0% throughout, including 0 of 144 on the official AgentDojo benchmark.",
  },
];

export const experience = [
  {
    when: "Aug 2025 — Now",
    role: "Software Development Engineer I",
    org: "Niyo",
    note: "Own the design system and the login, PAN and telemetry SDKs; led the onboarding PWA and co-built the Flutter credit card module.",
    points: [
      "Own the shared React design system used by 20 internal apps.",
      "Led the credit card onboarding PWA from an empty repo to production.",
      "Co-built the Flutter credit card module and in-app bill payment.",
      "Built data-heavy compliance consoles and a server-driven React Native home.",
    ],
  },
  {
    when: "Jan — Jul 2025",
    role: "Project Trainee",
    org: "Niyo",
    note: "Started on the design system and built the PAN verification SDK; converted to full-time.",
    points: ["Started on the shared design system.", "Built the PAN verification SDK.", "Converted to a full-time SDE-1 role."],
  },
  {
    when: "Oct 2021 — Oct 2025",
    role: "B.E., Electronics & Communication",
    org: "Thapar Institute of Engineering & Technology",
    note: "Patiala, Punjab.",
    points: ["Bachelor of Engineering, Patiala, Punjab."],
  },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Python", "Dart"] },
  { group: "Frontend & mobile", items: ["React", "Next.js", "React Native", "Flutter", "Redux", "Redux-Saga", "Zustand", "TanStack Query"] },
  { group: "Testing & tools", items: ["Jest", "Vitest", "Storybook", "Material UI", "Tailwind CSS", "Vite", "Webpack", "Git", "CI/CD", "Claude Code"] },
  { group: "Concepts", items: ["Component design", "State management", "Responsive design", "Accessibility", "Performance", "Code reviews", "Micro-frontends", "LLM agents"] },
];

// Open-source work. Storybook links go to a GitHub search of his pull requests there, so anyone can check them.
export const openSource = [
  {
    repo: "storybookjs/storybook",
    about: "UI component workshop · 90k+ stars",
    state: "Merged",
    title: "Docs blocks recover after an error is fixed",
    text: "Fixed a bug where Docs story blocks stayed stuck on an error after the code was fixed. Merged upstream.",
    stack: ["React", "TypeScript"],
    href: "https://github.com/storybookjs/storybook/pulls?q=is%3Apr+author%3Ashivastuu",
  },
  {
    repo: "storybookjs/storybook",
    about: "UI component workshop · 90k+ stars",
    state: "Open",
    title: "Find components by their other names",
    text: "Pull request adding alternative component names to sidebar search, with ranking, tests and docs.",
    stack: ["React", "TypeScript", "Vitest"],
    href: "https://github.com/storybookjs/storybook/pulls?q=is%3Apr+author%3Ashivastuu",
  },
  {
    repo: "shivastuu/redcell",
    about: "Red-team and guardrails for LLM agents",
    state: "Public",
    title: "RedCell",
    text: "An open-source tool that attacks AI agents through MCP. Its guardrails cut attack success from 83% to 0%.",
    stack: ["Python", "MCP", "Claude API", "Next.js"],
    href: "https://github.com/shivastuu/redcell",
  },
];

// The big achievements line in the ticker.
export const highlights = [
  "Moksha UI: a design system lit by a prism",
  "Design system used by 20 apps",
  "Fix merged into Storybook",
  "Video KYC SDK 78% lighter",
  "PWA: empty repo → production",
  "Attack success 83% → 0%",
  "Lighthouse 97 on Slow 4G",
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
  "Experience: 2 years at Niyo (Project Trainee from Jan 2025, SDE-1 since Aug 2025). Always say \"2 years of experience\", not \"nearly\" or \"almost\".",
  "React: 2 years of production React and TypeScript at Niyo, across an onboarding PWA, embeddable SDKs, a shared design system used by about 20 apps, and micro-frontend consoles.",
  "Moksha UI (github.com/shivastuu/moksha-ui, npm @moksha-ui/core and @moksha-ui/tokens): his own open-source design system for React and React Native with one component API: a real <button> with CSS on the web and Pressable with StyleSheet on iOS and Android, no react-native-web. createTheme({ brandColor }) generates a 10-step OKLCH colour scale and light and dark tokens kept at WCAG AA. Its PrismColorPicker lets you pick the brand colour from real light: a torch beam splits through a 3D glass prism in three.js, each wavelength bent by Snell's law with Fresnel reflections, and the picked colour re-themes the whole system. It is the first section on the home page (#moksha), where visitors can try it live.",
  "Open source: contributor to Storybook (90k+ GitHub stars). A bug fix where Docs story blocks stayed stuck on an error after the code was fixed was merged upstream; a second pull request adds alternative component names to sidebar search, with ranking, tests and docs, and is open.",
];

// Lighthouse lab scores for the home page on desktop (production build, measured before release). Re-measure after big changes.
export const lighthouse = { performance: 98, accessibility: 100, bestPractices: 100, seo: 100 };

export const site =
  "This site is built with Next.js 16 (App Router, statically exported to Netlify), GSAP and Lenis for restrained motion, and a light/dark theme. Each project has its own statically generated case-study page. It has a command palette (Cmd/Ctrl+K), live demos inside the case studies, light and dark themes, and scores 98 performance and 100 accessibility, best practices and SEO in Lighthouse on desktop.";
