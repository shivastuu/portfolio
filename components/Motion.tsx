"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
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

// Site-wide motion layer: Lenis smooth scroll plus the shared [data-reveal] effects.
export default function Motion({ children }: { children: ReactNode }) {
  const path = usePathname();
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
    // The preloader holds the page on a first visit and fires intro:done when it has parted.
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
          yPercent: 105,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 88%" },
        }),
      );
      if (document.querySelector("[data-reveal=fade]")) {
        // Opacity, not visibility: hidden content would drop out of the Tab order until scrolled to.
        gsap.set("[data-reveal=fade]", { y: 24, opacity: 0 });
        ScrollTrigger.batch("[data-reveal=fade]", {
          start: "top 92%",
          once: true,
          onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.06 }),
        });
      }
      // Touch screens have no cursor to move the light on metal cards (see Cursor.tsx), so scrolling moves it.
      if (matchMedia("(hover: none)").matches)
        gsap.utils.toArray<HTMLElement>("[data-metal]").forEach((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (s) => {
              el.style.setProperty("--mx", `${(10 + s.progress * 80).toFixed(1)}%`);
              el.style.setProperty("--my", `${(70 - s.progress * 60).toFixed(1)}%`);
              el.style.setProperty("--ry", `${((s.progress - 0.5) * 22).toFixed(2)}deg`);
              el.style.setProperty("--rx", `${((0.5 - s.progress) * 10).toFixed(2)}deg`);
            },
          }),
        );
      ScrollTrigger.sort();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });
    // Re-run for each page: client-side navigation swaps the page but keeps this layout mounted.
  }, { dependencies: [path], revertOnUpdate: true });

  return <>{children}</>;
}
