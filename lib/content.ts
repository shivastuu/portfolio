// Single source of truth for everything the site says. Edit here, not in components.

export const links = {
  email: "shivastuu@gmail.com",
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

export const projects = [
  {
    title: "Co-Branded Credit Card",
    kind: "Mobile · Flutter",
    hue: 75,
    big: "Fail-closed",
    caption: "Bill pay that can't charge twice",
    points: [
      "Flutter plugin running a React PWA over a JS bridge, wired to live bank SDKs.",
      "BBPS bill pay that can't pay twice — shipped behind a flag, no app release.",
    ],
    stack: ["Flutter", "Kotlin", "BLoC", "Remote Config"],
  },
  {
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
  },
  {
    title: "Auth & Encryption SDKs",
    kind: "Platform · SDKs",
    hue: 168,
    big: "−78%",
    caption: "Video KYC SDK, 2.9 MB → 651 KB",
    points: [
      "OTP login with HttpOnly sessions and one token refresh shared across tabs.",
      "Top contributor to the E2E-encrypted HTTP SDK; built encrypted telemetry capturing Core Web Vitals.",
    ],
    stack: ["TypeScript", "WebCrypto", "Web Locks", "gRPC-Web"],
  },
  {
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
  },
  {
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
  },
  {
    title: "RedCell",
    kind: "Side project · AI security",
    hue: 330,
    big: "59.5% → 0%",
    caption: "Attack success after hardening",
    points: [
      "Multi-agent LLM pipeline in LangGraph that red-teams tool-using LLM agents; every breach verified deterministically.",
      "Layered defences + a CI/CD gate: 0% on a 42-attack replay (31% adaptive).",
    ],
    stack: ["Python", "LangGraph", "FastMCP", "Claude API"],
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
