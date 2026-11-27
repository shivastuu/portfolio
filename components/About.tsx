"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION, whenNear } from "../lib/gsap";
import { about, hero, links, projects } from "../lib/content";

// *wrapped* phrases are the highlights; every word brightens in turn as the paragraph scrolls through.
const words = about
  .split(/(\*[^*]+\*)/)
  .flatMap((seg) => seg.replaceAll("*", "").split(/\s+/).filter(Boolean).map((w) => ({ w, em: seg.startsWith("*") })));

// Disciplines index: how many projects fall under each kind (the part before " · ").
const disciplines = Object.entries(
  projects.reduce<Record<string, number>>((acc, p) => {
    const k = p.kind.split(" · ")[0];
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {}),
);

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, (_ctx, contextSafe) =>
        whenNear(root.current!, contextSafe!(() => {
          gsap.fromTo(
            ".about__text .w",
            { "--p": 0 },
            { "--p": 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".about__text", start: "top 80%", end: "bottom 50%", scrub: true } },
          );
          gsap.from(".about__card", { y: 80, rotate: (i) => (i ? 3 : -3), opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".about__cards", start: "top 80%" } });
        })),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="about" id="about">
      <div className="about__top mono">
        <span>[04] About</span>
        <span>Niyo · since 2025</span>
        <span>Bangalore, IN</span>
      </div>
      <p className="about__text">
        {words.map(({ w, em }, i) => (
          <span key={i} className={em ? "w em" : "w"}>
            {w}{" "}
          </span>
        ))}
      </p>

      <div className="about__cards">
        <div className="about__card">
          <p className="mono about__card-head">
            <span>Currently</span>
            <span>[SDE-1]</span>
          </p>
          <p className="about__big">Software engineer at Niyo</p>
          <p className="about__note">
            <span className="dot" aria-hidden /> {hero.status}
          </p>
          <a href={`mailto:${links.email}`} className="about__btn" data-cursor="Email">
            <span className="dot dot--w" aria-hidden /> Email me
          </a>
        </div>
        <div className="about__card">
          <p className="mono about__card-head">
            <span>Disciplines</span>
            <span>[{String(projects.length).padStart(2, "0")}]</span>
          </p>
          <ul className="about__disc">
            {disciplines.map(([k, n]) => (
              <li key={k}>
                <a href="#work">
                  <span>{k}</span>
                  <span className="mono">[{String(n).padStart(2, "0")}]</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
