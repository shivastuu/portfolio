// Text of his resume (Shivastu_Shrivastava_SDE.pdf) for the "Ask about me" AI. The PDF itself isn't published on the site,
// and the phone number is left out on purpose. Update this whenever the PDF changes.
export const resume = `Shivastu Shrivastava. shivastuu@gmail.com | LinkedIn | GitHub | Portfolio | Bangalore, India

Summary
Frontend Engineer with 2 years of experience building production React and TypeScript applications at Niyo, a fintech company. Led a credit card onboarding PWA from scratch to production, owned a design system used by 20 internal apps, and built reusable SDKs and enterprise admin consoles.

Experience
Niyo – Indian Fintech: Cards, Forex and Partner-Bank Products, Bangalore, India
Software Development Engineer I (SDE-1), Aug 2025 – Present
Project Trainee, Jan 2025 – Jul 2025

Credit Card Onboarding PWA | React, TypeScript, Vite, Zustand, Workbox, Sentry, Strapi CMS
- Led the development of the credit card onboarding PWA from an empty repository to production, owning the PAN, Video KYC and CKYC verification flows.
- Diagnosed and fixed a production outage that stopped key onboarding screens from loading for all users, and resolved a KYC redirect loop that left users stuck.
- Turned the rejection screen into a secured-card offer, and built CMS-driven settings that let the operations team update content without a redeploy.

Co-Branded Credit Card Module | Flutter, Dart, BLoC, Kotlin, Firebase Remote Config
- Set up the Flutter plugin and co-built the credit card module end to end on live bank APIs, covering transactions, card controls, activation and statements.
- Built in-app credit card bill payment with status tracking that prevents duplicate payments, and rebuilt card activation when the bank retired its activation API.

Design System | React, TypeScript, Material UI, Storybook, Vite
- Owned the company's shared React design system, used by 20 internal apps; built 22 of its 49 reusable components from Figma and reviewed and merged code from other contributors.
- Made the library tree-shakeable, cutting the Video KYC SDK bundle by 78%, and added Storybook previews in CI.

Authentication, KYC and Platform SDKs | React, TypeScript, Axios, WebCrypto, Vitest
- Built embeddable OTP login and PAN verification SDKs that any host app can integrate with a single call, with secure session handling across browser tabs.
- As the top contributor to the company's end-to-end encrypted HTTP client, added per-domain encryption keys and fixed bugs that caused successful API calls to fail.

Compliance Workbench (Enterprise Admin Consoles) | React, TypeScript, single-spa, Redux-Saga
- Built data-heavy admin consoles for compliance teams, including a customer 360 view and KYC review screens with maker-checker approvals.
- Restructured the API layer into domain-based services with consistent authentication and request tracing, and combined separate transaction tables into one unified search.

React Native App | React Native, Expo, TanStack Query, Reanimated
- Built a server-driven home screen that updates from the CMS without an app release.

Open Source and Projects
Storybook (open-source UI component workshop, 90k+ GitHub stars) | React, TypeScript, Vitest
- Fixed a bug, merged upstream, where Docs story blocks stayed stuck on an error after the code was fixed.
- Opened a pull request adding alternative component names to sidebar search, with ranking, tests and docs.
RedCell – Red-Team and Guardrails for LLM Agents | Python, MCP, Claude API, Next.js
- Built an open-source tool that attacks AI agents via MCP; its guardrails cut attack success from 83% to 0%.

Technical Skills
Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3, Python, Dart
Frontend & Mobile: React, Next.js, React Native, Flutter, Redux, Redux-Saga, Zustand, TanStack Query
Testing & Tools: Jest, Vitest, Storybook, Material UI, Tailwind CSS, Vite, Webpack, Git, CI/CD, Claude Code
Concepts: Component Design, State Management, Responsive Design, Accessibility, Performance, Code Reviews

Education
Thapar Institute of Engineering and Technology, Patiala, Punjab
Bachelor of Engineering (B.E.) in Electronics and Communication Engineering, Oct 2021 – Oct 2025`;
