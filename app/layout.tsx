import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Motion from "../components/Motion";
import Cursor from "../components/Cursor";
import Ask from "../components/Ask";
import Boot from "../components/Boot";
import { boot } from "../lib/boot";
import { links } from "../lib/content";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

const description =
  "Software engineer at Niyo owning fintech features end to end: React and Next.js UIs, payments, KYC onboarding, embeddable SDKs and a design system 20 apps depend on.";

// The share image comes from app/opengraph-image.tsx; metadataBase makes its URL absolute.
export const metadata: Metadata = {
  metadataBase: new URL(links.site),
  title: "Shivastu Shrivastava — Software Engineer",
  description,
  openGraph: { type: "website", siteName: "Shivastu Shrivastava", title: "Shivastu Shrivastava — Software Engineer", description, url: "/" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the boot script sets data-theme and is-loading before React hydrates (no theme flash).
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(${boot})()` }} />
      </head>
      <body>
        <Boot />
        <Motion>{children}</Motion>
        <Cursor />
        <Ask />
      </body>
    </html>
  );
}
