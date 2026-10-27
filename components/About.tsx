"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { about, stats } from "../lib/content";

const words = about
  .split(/(\*[^*]+\*)/)
  .flatMap((seg) => seg.replaceAll("*", "").split(/\s+/).filter(Boolean).map((w) => ({ w, em: seg.startsWith("*") })));

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        // Words light up one by one as the paragraph scrolls through.
        gsap.fromTo(
          ".about__text .w",
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".about__text", start: "top 75%", end: "bottom 45%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(".stat b").forEach((el) => {
          const { from, to } = el.dataset;
          const n = { v: Number(from) };
          gsap.to(n, {
            v: Number(to),
            duration: 2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => void (el.textContent = n.v.toFixed(Number(from) % 1 ? 1 : 0)),
            onComplete: () => void (el.textContent = String(to)),
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="about" id="about">
      <p className="label" data-scramble>(About)</p>
      <p className="about__text">
        {words.map(({ w, em }, i) => (
          <span key={i} className={em ? "w serif accent" : "w"}>
            {w}{" "}
          </span>
        ))}
      </p>
      <ul className="stats">
        {stats.map((s) => (
          <li className="stat" key={s.label} data-reveal="fade">
            <span className="stat__num">
              <b data-from={s.from} data-to={s.to}>
                {s.to}
              </b>
              <span className="accent">{s.suffix}</span>
            </span>
            <span className="stat__label">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
