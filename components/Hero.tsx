"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { hero } from "../lib/content";
import Magnetic from "./Magnetic";

const chars = (word: string) =>
  [...word].map((c, i) => (
    <span className="char" key={i}>
      {c}
    </span>
  ));

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const done = () => {
        document.documentElement.classList.remove("is-loading");
        dispatchEvent(new Event("intro:done"));
      };
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", done);
      mm.add(MOTION, () => {
        const counter = root.current!.querySelector(".preloader__count")!;
        const n = { v: 0 };
        gsap
          .timeline({ onComplete: done })
          .to(n, {
            v: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => void (counter.textContent = String(Math.round(n.v)).padStart(3, "0")),
          })
          .to(".preloader__bar", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
          .to(".preloader", { yPercent: -100, duration: 1.1, ease: "expo.inOut" })
          .from(".hero__name .char", { yPercent: 115, duration: 1.4, ease: "expo.out", stagger: 0.03 }, "-=0.55")
          .from("[data-intro]", { y: 24, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, "-=1.1");

        // Name drifts and fades as the hero scrolls away.
        gsap.to(".hero__name", {
          yPercent: 35,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
      });
      // Glow trails the pointer on desktop.
      mm.add(`(pointer: fine) and ${MOTION}`, () => {
        const glow = root.current!.querySelector(".hero__glow")!;
        const x = gsap.quickTo(glow, "x", { duration: 1.6, ease: "power3" });
        const y = gsap.quickTo(glow, "y", { duration: 1.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          x((e.clientX / innerWidth - 0.5) * innerWidth * 0.4);
          y((e.clientY / innerHeight - 0.5) * innerHeight * 0.4);
        };
        addEventListener("pointermove", move);
        return () => removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="preloader" aria-hidden>
        <div className="preloader__row">
          <span>Shivastu Shrivastava</span>
          <span>Frontend &amp; Mobile</span>
        </div>
        <span className="preloader__count">000</span>
        <i className="preloader__bar" />
      </div>

      <header className="nav" data-intro>
        <a href="#top" className="nav__logo" aria-label="Back to top">
          SS<sup>©</sup>
        </a>
        <nav className="nav__links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
        </nav>
        <Magnetic>
          <a href="#contact" className="pill">
            Let&apos;s talk
          </a>
        </Magnetic>
      </header>

      <section className="hero" id="top">
        <div className="hero__glow" aria-hidden>
          <i />
          <i />
        </div>
        <div className="hero__top">
          <p className="label" data-intro>
            {hero.eyebrow}
          </p>
          <p className="label status" data-intro>
            <span className="dot" /> {hero.status}
          </p>
        </div>
        <h1 className="hero__name" aria-label="Shivastu Shrivastava">
          <span className="line" aria-hidden>
            {chars("Shivastu")}
          </span>
          <span className="line serif" aria-hidden>
            {chars("Shrivastava")}
          </span>
        </h1>
        <div className="hero__bottom">
          <p className="hero__lede" data-intro>
            {hero.lede}
          </p>
          <a href="#about" className="label scroll-cue" data-intro>
            Scroll <span aria-hidden>↓</span>
          </a>
        </div>
      </section>
    </div>
  );
}
