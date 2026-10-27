"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap";

// Masked line reveal: pair with data-reveal="line" on the parent.
export function Lines({ lines }: { lines: ReactNode[] }) {
  return lines.map((l, i) => (
    <span className="line" key={i}>
      <span>{l}</span>
    </span>
  ));
}

// Site-wide motion layer: Lenis smooth scroll + [data-reveal] scroll reveals.
export default function Motion({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!matchMedia(MOTION).matches) return;
    let lenis: Lenis | undefined;
    const raf = (t: number) => lenis?.raf(t * 1000);
    const start = () => {
      lenis = new Lenis({ anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    };
    // Hero's preloader holds the page; it fires intro:done when finished.
    if (document.documentElement.classList.contains("is-loading")) addEventListener("intro:done", start, { once: true });
    else start();
    return () => {
      removeEventListener("intro:done", start);
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal=line]").forEach((el) =>
        gsap.from(el.querySelectorAll(".line > span"), {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%" },
        }),
      );
      gsap.set("[data-reveal=fade]", { y: 40, autoAlpha: 0 });
      ScrollTrigger.batch("[data-reveal=fade]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.08 }),
      });
      // Section effects ran first (children before parent); order triggers by page position.
      ScrollTrigger.sort();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });
  });

  return children;
}
