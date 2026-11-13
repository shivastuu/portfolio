import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import Motion from "../components/Motion";
import Cursor from "../components/Cursor";
import Ask from "../components/Ask";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Shivastu Shrivastava — Software Engineer",
  description:
    "Product-minded engineer at Niyo shipping React UIs, mobile apps and Python LLM tooling — payments, KYC and encrypted SDKs, end to end.",
};

// Runs before first paint: picks the saved or OS theme (no flash), and holds scroll for the
// hero preloader only on the first home visit of a session.
const boot = `(()=>{const d=document.documentElement;let t,s;try{t=localStorage.getItem("theme");s=sessionStorage.getItem("intro")}catch(e){}
d.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
if(location.pathname==="/"&&!s)d.classList.add("is-loading")})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the boot script sets data-theme and is-loading before React hydrates.
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <Motion>{children}</Motion>
        <Cursor />
        <Ask />
      </body>
    </html>
  );
}
