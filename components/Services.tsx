"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION, whenNear } from "../lib/gsap";
import { services, skills } from "../lib/content";

// Stepped rows that drift in from alternating sides as you scroll (by less than the page margin, so text never
// leaves the screen; they simply rise on phones), plus a floating cloud of the toolbox.
const cloud = skills.flatMap((s) => s.items).slice(0, 22);

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, (_ctx, contextSafe) =>
        whenNear(root.current!, contextSafe!(() => {
          gsap.utils.toArray<HTMLElement>(".svc").forEach((row, i) =>
            gsap.from(row, {
              ...(innerWidth < 900 ? { y: 60 } : { x: (i % 2 ? 1 : -1) * Math.min(40, innerWidth * 0.03), y: 40 }),
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "top 55%", scrub: true },
            }),
          );
          gsap.utils.toArray<HTMLElement>(".cloud li").forEach((el, i) =>
            gsap.to(el, { y: (i % 3) * 8 - 8, x: (i % 2 ? 6 : -6), duration: 2.4 + (i % 5) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          );
        })),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="services" id="services">
      <div className="blobs" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="services__head">
        <p className="mono">[04]</p>
        <h2 className="services__title">What I do</h2>
        <ul className="cloud" aria-label="Toolbox">
          {cloud.map((t, i) => (
            <li key={t} style={{ fontSize: `${[13, 22, 15, 28, 12, 18][i % 6]}px`, opacity: [0.75, 1, 0.8, 1, 0.72, 0.9][i % 6] }}>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <ol className="svcs">
        {services.map((s, i) => (
          <li key={s.title} className="svc">
            <span className="svc__no mono">0{i + 1}</span>
            <h3 className="svc__title">{s.title}</h3>
            <p className="svc__note mono">{s.note}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
