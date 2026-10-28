import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Motion from "../components/Motion";
import Cursor from "../components/Cursor";

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
    // is-loading holds scroll until the hero preloader finishes.
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} is-loading`}>
      <body>
        <Motion>{children}</Motion>
        <Cursor />
      </body>
    </html>
  );
}
