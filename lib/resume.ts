// Text of public/Shivastu_Shrivastava_Resume.pdf for the "Ask about me" AI. Update it whenever the PDF changes.
// The phone number is left out on purpose; the AI points people to email and the PDF.
export const resume = `Shivastu Shrivastava. shivastuu@gmail.com | LinkedIn | GitHub | Portfolio | Bangalore, India

Summary
Product-minded Software Engineer with nearly 2 years shipping fintech features end to end, from React/TypeScript UIs to Python LLM-agent tooling, owning architecture, deployment and performance monitoring.

Experience
Niyo – Indian Fintech: Cards, Forex and Partner-Bank Products, Bangalore, India
Software Development Engineer I (SDE-1), Aug 2025 – Present
Project Trainee, Jan 2025 – Jul 2025

Co-Branded Credit Card Module | Flutter, Dart, BLoC, GetX, Kotlin, Firebase Remote Config
- Co-built the module as a Flutter plugin hosting a React PWA over a JavaScript bridge, integrating native bank SDKs and live bank APIs for homepage, transactions, card controls, activation and statements.
- Built in-app credit card bill payment (BBPS) with a fail-closed status-polling flow that prevents duplicate payments, rolled out behind a Remote Config flag without an app release.
- Optimized transaction-list rendering by scoping BLoC rebuilds per tab and replacing a per-frame blur, and built proactive device-token refresh for native bank SDK sessions.

Credit Card Onboarding PWA | React, TypeScript, Vite, Workbox, Zustand, Sentry, Strapi CMS
- Built the credit card onboarding PWA from an empty repo to production with a teammate, owning the PAN, Video KYC and CKYC flows and a status router mapping 12 CKYC states to 6 screens.
- Built CMS-driven remote config (Strapi) for downtime notices and Video KYC agent hours so ops change them without a redeploy, and a secured-card offer on the rejection screen.

Authentication, KYC and Platform SDKs | React, TypeScript, WebCrypto, Web Locks API, gRPC-Web
- Built embeddable OTP login and PAN verification SDKs for the company's web apps, with HttpOnly-cookie sessions and single-flight token refresh across browser tabs (Web Locks API).
- Built an end-to-end encrypted telemetry SDK capturing Core Web Vitals, with gRPC-Web transport, an IndexedDB offline queue and the RSA PKCS#1 v1.5 key wrap that WebCrypto lacks natively.
- Co-developed the company's end-to-end encrypted HTTP SDK (Axios, RSA-wrapped AES) as its top contributor, building per-domain key routing, cookie-based credentials and encrypted error handling.
- Engineered a shared React design system used by 20 internal apps to be fully tree-shakeable, and cut the Video KYC SDK by 78% (2.9 MB to 651 KB) by moving it onto that system.

Forex Compliance Workbench | React, TypeScript, single-spa micro-frontends, Redux-Saga, Tailwind CSS
- Built micro-frontend consoles for customer risk scoring and KYC review with maker-checker approvals and permission-gated PII, on a modular per-domain API layer with correlation IDs.

React Native App (Flutter Migration) | Expo, TypeScript, TanStack Query, Zustand, Reanimated, Jest
- Built the consumer app homepage as server-driven UI: 13 CMS-configured sections with offline fallbacks, so the product team changes content and order without an app release.
- Built partner-bank debit card controls (lock, block, channel toggles, limits, card details) with OTP-verified changes, plus WebView session seeding for embedded web apps.

Projects
RedCell – Autonomous Red-Team for LLM Agents | Python, LangGraph, FastMCP, Claude API
- Built an autonomous multi-agent LLM pipeline in LangGraph that red-teams tool-using LLM agents with prompt injection and policy evasion, confirming every breach with deterministic checks.
- Cut attack success from 59.5% to 0% on a fixed 42-attack offline replay (31% under adaptive attacks) by hardening the target with layered defences, with a CI/CD gate against regressions.

Technical Skills
Languages: TypeScript, JavaScript, Python, Dart, HTML, CSS
Frameworks & Tools: React, Next.js, React Native, Flutter, Tailwind CSS, Redux Toolkit, TanStack Query, BLoC, Vite, Webpack, Jest, Vitest, Sentry, Firebase, LangGraph, Claude API, Git, CI/CD
Concepts: REST APIs, LLM Agent Pipelines, Authentication & Session Security, Encryption, Performance Optimization & Monitoring, Micro-Frontends, Design Systems, Server-Driven UI, UI/UX, Unit Testing

Education
Thapar Institute of Engineering and Technology, Patiala, Punjab
Bachelor of Engineering (B.E.) in Electronics and Communication Engineering, Oct 2021 – Oct 2025`;
