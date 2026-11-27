"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { experience, skills } from "../lib/content";

// Dark "how I got here" section: a steel metal card turns in the middle as you scroll past the steps, oldest first.
// The card has real thickness: a few edge slabs sit between the front and back faces.
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
        <span className="mono">[06]</span>
      </div>

      <div className="exp__grid">
        <div className="exp__card" aria-hidden data-metal>
          <div className="idcard">
            <div className="idcard__tilt">
            <div className="idcard__inner">
              {[1.5, 0.5, -0.5, -1.5].map((z) => (
                <i key={z} className="idcard__edge" style={{ transform: `translateZ(${z}px)` }} />
              ))}
              <div className="idcard__face idcard__front metal metal--steel">
                <i className="metal__grain" />
                <i className="metal__rosette" />
                <i className="metal__light" />
                <div className="idcard__row">
                  <span className="engrave idcard__brand">S/S</span>
                  <span className="mono engrave">Engineering</span>
                </div>
                <span className="chip" />
                <div>
                  <b className="engrave">Shivastu Shrivastava</b>
                  <span className="mono engrave idcard__sub">SDE-1 · Niyo · since 01/25</span>
                </div>
              </div>
              <div className="idcard__face idcard__back metal metal--black">
                <i className="metal__grain" />
                <i className="metal__light" />
                <span className="idcard__stripe" />
                <span className="mono engrave">React · Next.js · Flutter · React Native</span>
                <b className="engrave">S/S</b>
              </div>
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
            <ul className="step__points">
              {e.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
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
