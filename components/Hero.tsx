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
          .from(".hero__name .char", { yPercent: 115, rotate: 8, duration: 1.4, ease: "expo.out", stagger: 0.03 }, "-=0.55")
          .from("[data-intro]", { y: 24, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, "-=1.1");

        // Word rotator: each word slides up and out, the next slides in.
        const words = gsap.utils.toArray<HTMLElement>(".rotator > span");
        gsap.set(words.slice(1), { yPercent: 100, autoAlpha: 0 });
        const loop = gsap.timeline({ repeat: -1, delay: 4 });
        words.forEach((w, i) =>
          loop
            .to(w, { yPercent: -100, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, "+=1.6")
            .fromTo(words[(i + 1) % words.length], { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", immediateRender: false }, "<0.35"),
        );

        // Name drifts and fades as the hero scrolls away.
        gsap.to(".hero__name", {
          yPercent: 35,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
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
            <br />I ship{" "}
            <span className="rotator" aria-hidden>
              {hero.rotator.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </span>
            <span className="sr-only">{hero.rotator.join(", ")}</span>
          </p>
          <a href="#about" className="label scroll-cue" data-intro>
            Scroll <span aria-hidden>↓</span>
          </a>
        </div>
      </section>
    </div>
  );
}
