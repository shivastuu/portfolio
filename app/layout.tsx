import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Motion from "../components/Motion";
import Cursor from "../components/Cursor";
import Ask from "../components/Ask";
import Boot from "../components/Boot";
import { boot } from "../lib/boot";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Shivastu Shrivastava — Software Engineer",
  description:
    "Product-minded engineer at Niyo shipping React UIs, mobile apps and Python LLM tooling — payments, KYC and encrypted SDKs, end to end.",
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
