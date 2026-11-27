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

// Section header shared by every block: title on the left, bracketed index on the right, hairline above.
export function SectionHead({ title, n }: { title: string; n: string }) {
  return (
    <div className="shead" data-reveal="fade">
      <h2 className="shead__title">{title}</h2>
      <span className="shead__n">[{n}]</span>
    </div>
  );
}

// Site-wide motion layer: Lenis smooth scroll plus two quiet [data-reveal] effects. Nothing loops, nothing follows the cursor.
export default function Motion({ children }: { children: ReactNode }) {
  const path = usePathname();
  useEffect(() => {
    if (!matchMedia(MOTION).matches) return;
    const lenis = new Lenis({ anchors: true });
    const raf = (t: number) => lenis.raf(t * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
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
      gsap.set("[data-reveal=fade]", { y: 24, autoAlpha: 0 });
      ScrollTrigger.batch("[data-reveal=fade]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.06 }),
      });
      ScrollTrigger.sort();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });
    // Re-run for each page: client-side navigation swaps the page but keeps this layout mounted.
  }, { dependencies: [path], revertOnUpdate: true });

  return <>{children}</>;
}
