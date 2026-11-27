"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION, whenNear } from "../lib/gsap";
import { projects } from "../lib/content";
import Cover from "./Covers";

const pad = (n: number) => String(n).padStart(2, "0");

// Full-height colour panels. On desktop each one sticks and the next slides over it while the one underneath
// sinks back; inside, every mock element drifts at its own depth.
export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, (_ctx, contextSafe) =>
        whenNear(root.current!, contextSafe!(() => {
          const panels = gsap.utils.toArray<HTMLElement>(".panel");
          gsap.from(".work__title .line > span", { yPercent: 105, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".work__head", start: "top 75%" } });
          panels.forEach((p, i) => {
            p.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
              const d = Number(el.dataset.depth);
              gsap.fromTo(el, { y: 90 * d }, { y: -50 * d, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "top top", scrub: true } });
            });
            gsap.from(p.querySelector(".panel__no span"), { yPercent: 100, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 60%" } });
            gsap.from(p.querySelectorAll(".panel__text > *"), { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: p, start: "top 55%" } });
            const next = panels[i + 1];
            if (next && matchMedia("(min-width: 900px)").matches)
              gsap.to(p.querySelector(".panel__link"), {
                scale: 0.9,
                "--dim": 0.55,
                ease: "none",
                scrollTrigger: { trigger: next, start: "top bottom", end: "top 72px", scrub: true },
              });
          });
        })),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work" id="work">
      <div className="work__head">
        <p className="mono">[02] Selected work</p>
        <h2 className="work__title">
          <span className="line">
            <span>Selected</span>
          </span>
          <span className="line">
            <span>
              work <sup>[{pad(projects.length)}]</sup>
            </span>
          </span>
        </h2>
        <p className="work__intro">
          Fintech, design systems and AI security. Every panel opens the full case study: the problem, what I built, the hard part and the result.
        </p>
      </div>

      <ol className="panels">
        {projects.map((p, i) => (
          <li key={p.slug} className="panel" style={{ "--c": p.color, "--on": p.on } as CSSProperties}>
            <Link href={`/work/${p.slug}`} className="panel__link" data-cursor="View case">
              <div className="panel__cover">
                <Cover slug={p.slug} />
              </div>
              <div className="panel__info">
                <p className="panel__no">
                  <span>{pad(i + 1)}</span>
                </p>
                <div className="panel__text">
                  <p className="mono">{p.kind}</p>
                  <h3 className="panel__title">{p.title}</h3>
                  <p className="panel__cap">
                    <b>{p.big}</b> {p.caption}
                  </p>
                  <ul className="panel__points">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <ul className="tags">
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <span className="panel__cta mono">View case study ↗</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
