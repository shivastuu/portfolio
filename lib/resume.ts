// Text of public/Shivastu_Shrivastava_Resume.pdf (source: ~/Desktop/resume/resume-main.tex) for the "Ask about me" AI.
// Update it whenever the PDF changes.
export const resume = `Shivastu Shrivastava. +91 7704025456 | shivastuu@gmail.com | LinkedIn | GitHub | Portfolio | Bangalore, India

Summary
Software Engineer with nearly 2 years owning fintech products end to end at Niyo: React, Next.js and TypeScript on the web, Flutter and React Native on mobile, from architecture to production monitoring.

Experience
Niyo – Indian Fintech: Cards, Forex and Partner-Bank Products, Bangalore, India
Software Development Engineer I (SDE-1), Aug 2025 – Present
Project Trainee, Jan 2025 – Jul 2025

Co-Branded Credit Card Module | Flutter, Dart, BLoC, GetX, Kotlin, Firebase Remote Config
- Scaffolded the Flutter plugin and co-built the card module end to end with one teammate: homepage, transactions, card controls, activation and statements on live bank APIs, hosting a React PWA over a JS bridge.
- Built and launched in-app credit card bill payment (BBPS) with fail-closed status polling that prevents duplicate payments, shipped via a Remote Config flag without an app update.
- Rebuilt card activation around PIN setup when the bank retired its activation API, and removed transaction-list lag by scoping BLoC rebuilds per tab.

Credit Card Onboarding PWA | React, TypeScript, Vite, Workbox, Zustand, Sentry, Strapi CMS
- Led the onboarding PWA from an empty repo to production, owning the PAN, Video KYC and CKYC flows and a status router mapping 12 CKYC states to 6 screens.
- Built CMS-driven remote config (Strapi) so ops change downtime notices and Video KYC agent hours without a redeploy, plus a secured-card offer on the rejection screen.
- Root-caused a production outage where a firewall rule blocked some generated JS chunk names and fixed it at the build level; fixed iOS WebKit cross-browser bugs.

Design System | React, TypeScript, Material UI, Storybook, Vite
- Owned the company's shared React design system used by 20 internal apps: built 22 of its 49 components from Figma tokens, shipped about 40 releases and wrote its adoption guide, incl. Next.js.
- Made it tree-shakeable; moving the Video KYC SDK onto it cut that SDK by 78% (2.9 MB to 651 KB).

Authentication, KYC and Platform SDKs | React, TypeScript, Axios, WebCrypto, Web Locks API, gRPC-Web
- Owned and developed embeddable OTP login and PAN verification SDKs that mount in any host app with one call, with HttpOnly-cookie sessions and single-flight token refresh across tabs (Web Locks API).
- Top contributor to the company's end-to-end encrypted HTTP SDK: per-domain key routing and encrypted error handling, and took npm audit from 24 vulnerabilities to 0.
- Owned and developed an encrypted telemetry SDK capturing Core Web Vitals over gRPC-Web, and shipped a page scoring Lighthouse 97 Performance / 100 Accessibility on Slow 4G.

Compliance Workbench and React Native App | React, single-spa, Redux-Saga, Expo, TanStack Query
- Built micro-frontend consoles for KYC review and risk scoring with maker-checker approvals and gated PII.
- Shipped a server-driven React Native homepage (13 CMS sections) and OTP-verified debit card controls.

Projects
RedCell – Autonomous Red-Team for LLM Agents | Python, LangGraph, FastMCP, Next.js
- Built a multi-agent LangGraph framework that attacks tool-using LLM agents and cut attack success from 59.5% to 0% on a fixed 42-attack replay (31% adaptive) with layered defences and a CI gate.
Portfolio – shivastuu.netlify.app | Next.js 16, TypeScript, GSAP, Netlify Functions
- Built a statically generated Next.js App Router site with per-project case studies and an AI assistant that answers recruiters from my resume via a rate-limited serverless function.

Technical Skills
Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3, Python, Dart
Frontend & Mobile: React, Next.js (App Router, SSG), React Native, Flutter, Redux, Zustand, TanStack Query
UI & Tools: Material UI, Tailwind CSS, Storybook, Vite, Webpack, Jest, Vitest, Sentry, Lighthouse, Git, CI/CD
Concepts: REST APIs, Web Performance, Core Web Vitals, Accessibility, Design Systems, Micro-Frontends, PWAs

Education
Thapar Institute of Engineering and Technology, Patiala, Punjab
Bachelor of Engineering (B.E.) in Electronics and Communication Engineering, Oct 2021 – Oct 2025`;
