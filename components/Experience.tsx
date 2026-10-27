"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { experience, skills } from "../lib/content";
import { Lines } from "./Motion";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        // Timeline rule draws itself as you scroll.
        gsap.from(".timeline__rule", {
          scaleY: 0,
          ease: "none",
          scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 60%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="experience" id="experience">
      <p className="label" data-scramble>(Experience)</p>
      <h2 className="h2" data-reveal="line">
        <Lines lines={["Where I've", <em className="serif">been building</em>]} />
      </h2>

      <ol className="timeline">
        <i className="timeline__rule" aria-hidden />
        {experience.map((e) => (
          <li key={e.role} className="timeline__row" data-reveal="fade">
            <span className="label">{e.when}</span>
            <div>
              <h3>{e.role}</h3>
              <p className="accent">{e.org}</p>
            </div>
            <p className="muted">{e.note}</p>
          </li>
        ))}
      </ol>

      <div className="skills">
        {skills.map((s) => (
          <div key={s.group} data-reveal="fade">
            <p className="label">{s.group}</p>
            <ul className="chips">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
