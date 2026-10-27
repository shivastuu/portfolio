"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { projects } from "../lib/content";
import { Lines } from "./Motion";

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the section and scroll the cards sideways.
      mm.add(`${MOTION} and (min-width: 900px)`, () => {
        const track = root.current!.querySelector<HTMLElement>(".work__track")!;
        const dist = () => track.scrollWidth - innerWidth;
        const slide = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: root.current, pin: true, scrub: 1, end: () => `+=${dist()}`, invalidateOnRefresh: true },
        });
        gsap.to(".work__progress i", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".card__big").forEach((el) =>
          gsap.fromTo(el, { x: 40 }, {
            x: -40,
            ease: "none",
            scrollTrigger: { trigger: el, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          }),
        );
      });
      mm.add(`${MOTION} and (max-width: 899px)`, () => {
        gsap.utils.toArray<HTMLElement>(".card").forEach((el) =>
          gsap.from(el, { y: 60, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }),
        );
      });
    },
    { scope: root },
  );

  // Spotlight follows the pointer inside each card (pure CSS vars).
  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={root} className="work" id="work">
      <div className="work__track">
        <div className="work__intro">
          <p className="label">(Selected work — {String(projects.length).padStart(2, "0")})</p>
          <h2 className="h2" data-reveal="line">
            <Lines lines={["Things", <em className="serif">I&apos;ve shipped</em>]} />
          </h2>
          <p className="muted">Payments, onboarding, SDKs and compliance tools in production at a fintech, plus one side project in AI security.</p>
        </div>
        {projects.map((p, i) => (
          <article key={p.title} className="card" style={{ "--h": p.hue } as CSSProperties} onPointerMove={spotlight}>
            <div className="card__top label">
              <span>{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              <span>{p.kind}</span>
            </div>
            <div className="card__hero">
              <p className="card__big">{p.big}</p>
              <p className="card__caption">{p.caption}</p>
            </div>
            <h3 className="card__title">{p.title}</h3>
            <ul className="card__points">
              {p.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <ul className="chips">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="work__progress" aria-hidden>
        <i />
      </div>
    </section>
  );
}
