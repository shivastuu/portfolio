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
  title: "Shivastu Shrivastava — Frontend & Mobile Engineer",
  description:
    "Frontend & mobile engineer at Niyo building payments, KYC onboarding and encrypted SDKs across React, React Native and Flutter.",
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
