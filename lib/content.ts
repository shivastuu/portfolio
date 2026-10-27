// Single source of truth for everything the site says. Edit here, not in components.

export const links = {
  email: "shivastuu@gmail.com",
  linkedin: "https://www.linkedin.com/in/shivastu-srivastava-811248212",
  github: "https://github.com/shivastuu",
  resume: "/Shivastu_Shrivastava_Resume.pdf",
};

export const hero = {
  eyebrow: "Software Engineer — Niyo, Bangalore",
  status: "Open to frontend & mobile roles",
  lede: "Frontend & mobile engineer building payments, KYC onboarding and encrypted SDKs across React, React Native and Flutter.",
};

export const marquee = [
  "TypeScript", "React", "React Native", "Flutter", "Dart", "TanStack Query",
  "Zustand", "BLoC", "Reanimated", "WebCrypto", "gRPC-Web", "Micro-frontends",
];

// *wrapped* words render in the accent serif.
export const about =
  "I build production fintech end to end — the bill payment that *fails closed,* the KYC flow that turns *twelve backend states* into six clear screens, the SDK that drops from *2.9 MB to 651 KB.* Reliability and security first. Then the polish.";

export const stats = [
  { from: 0, to: 3, suffix: "", label: "Platforms in production — web, React Native, Flutter" },
  { from: 0, to: 20, suffix: "", label: "Internal apps on the tree-shakeable design system" },
  { from: 0, to: 78, suffix: "%", label: "Smaller Video KYC SDK, 2.9 MB → 651 KB" },
  { from: 59.5, to: 0, suffix: "%", label: "LLM attack success after hardening (RedCell)" },
];

export const projects = [
  {
    title: "Co-Branded Credit Card Module",
    kind: "Mobile · Flutter",
    hue: 75,
    big: "Fail-closed",
    caption: "Bill payments that can't go out twice",
    points: [
      "Flutter plugin hosting a React PWA over a JavaScript bridge, wired to native bank SDKs and live bank APIs.",
      "In-app BBPS bill payment with fail-closed status polling, shipped behind a Remote Config flag — no app release.",
      "Faster transaction lists: BLoC rebuilds scoped per tab, per-frame blur removed.",
    ],
    stack: ["Flutter", "Dart", "BLoC", "GetX", "Kotlin", "Remote Config"],
  },
  {
    title: "Credit Card Onboarding PWA",
    kind: "Web · PWA",
    hue: 262,
    big: "12 → 6",
    caption: "CKYC states routed to clear screens",
    points: [
      "Empty repo to production with a teammate; owned the PAN, Video KYC and CKYC flows.",
      "Status router mapping 12 CKYC states to 6 screens.",
      "Strapi-driven config so ops change downtime notices and Video KYC agent hours without a redeploy.",
    ],
    stack: ["React", "TypeScript", "Vite", "Workbox", "Zustand", "Sentry", "Strapi"],
  },
  {
    title: "Auth, KYC & Platform SDKs",
    kind: "Platform · SDKs",
    hue: 158,
    big: "−78%",
    caption: "Video KYC SDK, 2.9 MB → 651 KB",
    points: [
      "OTP login and PAN verification SDKs with HttpOnly-cookie sessions and single-flight token refresh across tabs (Web Locks API).",
      "End-to-end encrypted telemetry over gRPC-Web with an IndexedDB offline queue and the RSA key wrap WebCrypto lacks.",
      "Top contributor to the encrypted HTTP SDK; made the shared design system tree-shakeable for 20 apps.",
    ],
    stack: ["React", "TypeScript", "WebCrypto", "Web Locks", "gRPC-Web"],
  },
  {
    title: "Forex Compliance Workbench",
    kind: "Web · Micro-frontends",
    hue: 28,
    big: "Maker–checker",
    caption: "Approvals with permission-gated PII",
    points: [
      "Micro-frontend consoles for customer risk scoring and KYC review.",
      "Maker-checker approvals with permission-gated PII.",
      "Modular per-domain API layer with correlation IDs.",
    ],
    stack: ["React", "TypeScript", "single-spa", "Redux-Saga", "Tailwind"],
  },
  {
    title: "React Native App",
    kind: "Mobile · React Native",
    hue: 205,
    big: "13",
    caption: "Server-driven home sections, no app release",
    points: [
      "Homepage as server-driven UI: 13 CMS-configured sections with offline fallbacks.",
      "Partner-bank debit card controls — lock, block, channel toggles, limits — with OTP-verified changes.",
      "WebView session seeding for embedded web apps.",
    ],
    stack: ["Expo", "TypeScript", "TanStack Query", "Zustand", "Reanimated", "Jest"],
  },
  {
    title: "RedCell",
    kind: "Side project · AI security",
    hue: 352,
    big: "59.5% → 0%",
    caption: "Attack success on a fixed 42-attack replay",
    points: [
      "Autonomous multi-agent red team that attacks tool-using LLM agents with prompt injection and policy evasion.",
      "Every breach confirmed by deterministic checks, not by another model.",
      "Layered defences cut attack success to 0% offline (31% under adaptive attacks), guarded by a CI gate.",
    ],
    stack: ["Python", "LangGraph", "FastMCP", "Claude API"],
  },
];

export const experience = [
  { when: "Aug 2025 — Now", role: "Software Development Engineer I", org: "Niyo", note: "Cards, forex and partner-bank products across web, React Native and Flutter." },
  { when: "Jan — Jul 2025", role: "Project Trainee", org: "Niyo", note: "Converted to full-time SDE-1." },
  { when: "2021 — 2025", role: "B.E., Electronics & Communication", org: "Thapar Institute of Engineering & Technology", note: "Patiala, Punjab." },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Dart", "Python"] },
  { group: "Frameworks & tools", items: ["React", "React Native", "Flutter", "Redux Toolkit", "TanStack Query", "BLoC", "Vite", "Webpack", "Jest", "Vitest", "Sentry", "Firebase", "CI/CD"] },
  { group: "Concepts", items: ["Auth & session security", "Encryption", "Performance", "Micro-frontends", "Design systems", "Unit testing"] },
];
