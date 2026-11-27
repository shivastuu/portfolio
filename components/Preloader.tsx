"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

// First home visit of a session: a fold line draws down the page, the name slides in from both sides
// while a counter runs, then the page parts along the fold. Finishes in about 2 s and fires "intro:done".
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const done = () => {
        html.classList.remove("is-loading");
        try {
          sessionStorage.setItem("intro", "1");
        } catch {}
        // Fired outside GSAP's callback scope, so listeners query the whole page rather than this component.
        setTimeout(() => dispatchEvent(new Event("intro:done")));
      };
      if (!html.classList.contains("is-loading")) return;
      const count = root.current!.querySelector(".pre__count")!;
      const n = { v: 0 };
      gsap
        .timeline({ onComplete: done })
        .to(".pre__fold", { scaleY: 1, duration: 0.6, ease: "power3.inOut" })
        .from(".pre__name--a", { xPercent: -60, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0.25)
        .from(".pre__name--b", { xPercent: 60, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0.25)
        .to(n, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: () => void (count.textContent = String(Math.round(n.v)).padStart(3, "0")) }, 0)
        .to(".pre__half--l", { xPercent: -100, duration: 0.9, ease: "expo.inOut" }, 1.25)
        .to(".pre__half--r", { xPercent: 100, duration: 0.9, ease: "expo.inOut" }, 1.25)
        .to(".pre__fold, .pre__count, .pre__meta", { autoAlpha: 0, duration: 0.3 }, 1.2);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pre" aria-hidden>
      <div className="pre__half pre__half--l">
        <span className="pre__name pre__name--a">Shivastu</span>
      </div>
      <div className="pre__half pre__half--r">
        <span className="pre__name pre__name--b">Shrivastava</span>
      </div>
      <i className="pre__fold" />
      <span className="pre__meta mono">Software engineer — portfolio</span>
      <span className="pre__count mono">000</span>
    </div>
  );
}
