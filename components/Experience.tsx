"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { experience, skills } from "../lib/content";

// Dark "how I got here" section: a 3D card turns in the middle as you scroll past the steps, oldest first.
const steps = [...experience].reverse();
const short = ["Engineering", "Trainee", "SDE — I"];

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          ".idcard__inner",
          { rotateY: -25, rotateX: 12 },
          { rotateY: 335, rotateX: -8, ease: "none", scrollTrigger: { trigger: ".exp__grid", start: "top 70%", end: "bottom 40%", scrub: 1 } },
        );
        gsap.utils.toArray<HTMLElement>(".step").forEach((el) =>
          gsap.from(el.children, { y: 50, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: el, start: "top 75%" } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="exp" id="experience">
      <div className="exp__head">
        <h2 className="exp__title">How I got here</h2>
        <span className="mono">[05]</span>
      </div>

      <div className="exp__grid">
        <div className="exp__card" aria-hidden>
          <div className="idcard">
            <div className="idcard__inner">
              <div className="idcard__face idcard__front">
                <span className="mono">Niyo · Engineering</span>
                <span className="idcard__chip" />
                <b>Shivastu Shrivastava</b>
                <span className="mono">SDE-1 · at Niyo since Jan 2025</span>
              </div>
              <div className="idcard__face idcard__back">
                <i className="idcard__stripe" />
                <span className="mono">React · Next.js · Flutter · React Native</span>
                <b>S/S</b>
              </div>
            </div>
          </div>
        </div>
        {steps.map((e, i) => (
          <article key={e.role} className={`step step--${i % 2 ? "r" : "l"}`}>
            <p className="mono">[00{i + 1}]</p>
            <h3 className="step__title">{short[i] ?? e.role}</h3>
            <p className="step__role">
              {e.role} · {e.org}
            </p>
            <p className="step__note">{e.note}</p>
            <p className="mono step__when">{e.when}</p>
          </article>
        ))}
      </div>

      <div className="exp__skills">
        {skills.map((s) => (
          <div key={s.group}>
            <p className="mono">{s.group}</p>
            <p>{s.items.join(" / ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
