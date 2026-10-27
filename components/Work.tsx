"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap";
import { projects } from "../lib/content";
import { Lines } from "./Motion";
import Magnetic from "./Magnetic";

const pad = (n: number) => String(n).padStart(2, "0");

// Spotlight + 3D tilt follow the pointer (CSS vars; the tilt only applies on fine pointers).
const tilt = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  el.style.setProperty("--x", `${px * 100}%`);
  el.style.setProperty("--y", `${py * 100}%`);
  el.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
  el.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
};
const untilt = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const map = root.current!.querySelector<HTMLElement>(".roadmap")!;
      const svg = map.querySelector("svg")!;
      const milestones = gsap.utils.toArray<HTMLElement>(".milestone", map);

      // Road is drawn through the measured node centres, so it follows any layout.
      const build = () => {
        const box = map.getBoundingClientRect();
        const pts = milestones.map((m) => {
          const r = m.querySelector(".node")!.getBoundingClientRect();
          return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
        });
        const swing = innerWidth < 900 ? 0 : Math.min(140, box.width * 0.1);
        let d = `M${pts[0][0]},0 L${pts[0][0]},${pts[0][1]}`;
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], s = i % 2 ? swing : -swing, h = (y1 - y0) / 2;
          d += ` C${x0 + s},${y0 + h} ${x1 + s},${y1 - h} ${x1},${y1}`;
        }
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
        svg.querySelector("linearGradient")!.setAttribute("y2", String(box.height));
        svg.querySelectorAll("path").forEach((p) => p.setAttribute("d", d));
      };
      build();
      ScrollTrigger.addEventListener("refreshInit", build);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => milestones.forEach((m) => m.classList.add("is-active")));
      mm.add({ motion: MOTION, desktop: "(min-width: 900px)" }, (ctx) => {
        if (!ctx.conditions!.motion) return;
        const road = { trigger: map, start: "top 60%", end: "bottom 60%", scrub: 0.6, invalidateOnRefresh: true };
        const line = svg.querySelector<SVGPathElement>(".roadmap__line")!;
        const len = () => line.getTotalLength();
        gsap.fromTo(".roadmap__line, .roadmap__glow", { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: road });
        gsap.to(".roadmap__dot", { motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5] }, ease: "none", scrollTrigger: road });

        milestones.forEach((m, i) => {
          const side = ctx.conditions!.desktop && i % 2 === 0 ? -1 : 1;
          const enter = { trigger: m, start: "top 75%" };
          // Node lights up when the road reaches it, and dims again on the way back up.
          ScrollTrigger.create({
            trigger: m.querySelector(".node"),
            start: "center 60%",
            onEnter: () => m.classList.add("is-active"),
            onLeaveBack: () => m.classList.remove("is-active"),
          });
          gsap.from(m.querySelector(".card"), { x: side * 140, rotate: side * 4, autoAlpha: 0, duration: 1.3, ease: "expo.out", clearProps: "transform", scrollTrigger: enter });
          gsap.from(m.querySelectorAll(".milestone__metric > *"), { yPercent: 60, autoAlpha: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: enter });
          gsap.from(m.querySelectorAll(".chips li"), { scale: 0, autoAlpha: 0, duration: 0.5, ease: "back.out(2.5)", stagger: 0.05, delay: 0.4, scrollTrigger: enter });
          if (ctx.conditions!.desktop) gsap.fromTo(m.querySelector(".milestone__metric"), { y: 70 }, { y: -70, ease: "none", scrollTrigger: { trigger: m, scrub: true } });
        });
      });
      return () => ScrollTrigger.removeEventListener("refreshInit", build);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work" id="work">
      <div className="work__head">
        <div>
          <p className="label" data-scramble>(Selected work — {pad(projects.length)})</p>
          <h2 className="h2" data-reveal="line">
            <Lines lines={["The roadmap", <em className="serif">so far</em>]} />
          </h2>
        </div>
        <p className="muted" data-reveal="fade">Six shipped milestones in fintech and AI security. Scroll to unlock each one.</p>
      </div>

      <div className="roadmap">
        <svg className="roadmap__svg" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="road" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
              <stop offset="0" stopColor="#c8f53b" />
              <stop offset="0.35" stopColor="#5ce1e6" />
              <stop offset="0.7" stopColor="#9b87ff" />
              <stop offset="1" stopColor="#ff7ac6" />
            </linearGradient>
          </defs>
          <path className="roadmap__track" />
          <path className="roadmap__glow" />
          <path className="roadmap__line" />
          <g className="roadmap__dot">
            <circle r="18" />
            <circle r="7" />
          </g>
        </svg>

        <ol className="milestones">
          {projects.map((p, i) => (
            <li key={p.title} className="milestone" style={{ "--h": p.hue } as CSSProperties}>
              <span className="node">{pad(i + 1)}</span>
              <div className="milestone__metric">
                <p className="milestone__big">{p.big}</p>
                <p className="milestone__caption">{p.caption}</p>
              </div>
              <article className="card" onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="card__top label">
                  <span>Milestone {pad(i + 1)}</span>
                  <span>{p.kind}</span>
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
            </li>
          ))}
          <li className="milestone milestone--next" style={{ "--h": 75 } as CSSProperties}>
            <span className="node">{pad(projects.length + 1)}</span>
            <div className="milestone__metric">
              <p className="milestone__big serif">Your team?</p>
              <p className="milestone__caption">The next milestone</p>
            </div>
            <article className="card" onPointerMove={tilt} onPointerLeave={untilt}>
              <div className="card__top label">
                <span>Milestone {pad(projects.length + 1)}</span>
                <span>Up next</span>
              </div>
              <h3 className="card__title">Frontend or mobile role</h3>
              <p className="muted">Looking for my next hard problem — payments, auth, performance or polished UI.</p>
              <Magnetic>
                <a href="#contact" className="pill pill--solid">Let&apos;s talk →</a>
              </Magnetic>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
