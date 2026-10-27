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

// Site-wide motion layer: Lenis smooth scroll, aurora backdrop, progress bar and [data-*] scroll effects.
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
      const page = { start: 0, end: "max", scrub: 0.4 };
      gsap.to(".page-progress", { scaleX: 1, ease: "none", scrollTrigger: page });
      // Aurora blobs wander as you scroll, so every section gets its own light.
      gsap.to(".aurora i:nth-child(1)", { yPercent: 160, xPercent: 40, ease: "none", scrollTrigger: { ...page, scrub: 1.5 } });
      gsap.to(".aurora i:nth-child(2)", { yPercent: -80, xPercent: -70, ease: "none", scrollTrigger: { ...page, scrub: 1.5 } });
      gsap.to(".aurora i:nth-child(3)", { yPercent: -150, xPercent: 50, ease: "none", scrollTrigger: { ...page, scrub: 1.5 } });

      gsap.utils.toArray<HTMLElement>("[data-reveal=line]").forEach((el) =>
        gsap.from(el.querySelectorAll(".line > span"), {
          yPercent: 110,
          rotate: 3,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%" },
        }),
      );
      gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((el) =>
        gsap.to(el, {
          duration: 1.4,
          scrambleText: { text: el.textContent ?? "", chars: "01<>/#*+", revealDelay: 0.3, speed: 0.5 },
          scrollTrigger: { trigger: el, start: "top 90%" },
        }),
      );
      gsap.set("[data-reveal=fade]", { y: 40, autoAlpha: 0 });
      ScrollTrigger.batch("[data-reveal=fade]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.08 }),
      });
      ScrollTrigger.sort();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });
  });

  return (
    <>
      <div className="aurora" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      {children}
      <div className="page-progress" aria-hidden />
    </>
  );
}
