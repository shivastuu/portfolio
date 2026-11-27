"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { hero, projects } from "../lib/content";
import { useClock } from "../lib/useClock";
import Nav from "./Nav";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const time = useClock();

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        // One entrance, then the hero sits still: the name rises out of its own baseline, the rest follows.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(".hero__word > span", { yPercent: 102, duration: 1.3, stagger: 0.09 })
          .from(".hero [data-in]", { y: 16, autoAlpha: 0, duration: 1, stagger: 0.05 }, 0.25);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <Nav home />

      <section className="hero" id="top">
        <h1 className="sr-only">Shivastu Shrivastava, software engineer</h1>

        <div className="hero__meta mono">
          <span data-in>[ Software engineer ]</span>
          <span data-in>Niyo — Bangalore</span>
          <span data-in>
            IST <span className="tnum">{time || "--:--"}</span>
          </span>
          <span data-in>Selected work [{pad(projects.length)}]</span>
        </div>

        <div className="hero__mid">
          <dl className="hero__facts" data-in>
            {hero.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="hero__lede" data-in>
            {hero.lede}
          </p>
        </div>

        <div className="hero__row">
          <p className="hero__word" aria-hidden>
            <span>Shivastu</span>
          </p>
          <nav className="hero__index" aria-label="Case studies" data-in>
            <p className="hero__index-head mono">
              <span>Index</span>
              <span>[{pad(projects.length)}]</span>
            </p>
            <ol>
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`}>
                    <span>{p.title}</span>
                    <span className="mono">{pad(i + 1)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <p className="hero__word hero__word--last" aria-hidden>
          <span>Shrivastava</span>
        </p>
      </section>
    </div>
  );
}
