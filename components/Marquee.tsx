"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION, whenNear } from "../lib/gsap";
import { highlights, marquee, projects } from "../lib/content";

// Two running lines: achievements (big, with colour tiles) and the stack (smaller, the other way).
// They drift on their own, follow the scroll direction and speed up with scroll velocity.
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        let stop = () => {};
        const unwatch = whenNear(root.current!, () => void (stop = start()));
        const start = () => {
        const setA = gsap.quickSetter(".ticker__track--a", "xPercent");
        const setB = gsap.quickSetter(".ticker__track--b", "xPercent");
        const wrap = gsap.utils.wrap(-50, 0);
        let x = 0, dir = -1, boost = 0;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (s) => {
            dir = s.direction === 1 ? -1 : 1;
            boost = Math.min(Math.abs(s.getVelocity()) / 250, 12);
          },
        });
        const tick = (_: number, dt: number) => {
          x = wrap(x + dir * (1 + boost) * dt * 0.0022);
          boost *= 0.93;
          setA(x);
          setB(-50 - x);
        };
        gsap.ticker.add(tick);
        return () => {
          st.kill();
          gsap.ticker.remove(tick);
        };
        };
        return () => {
          unwatch();
          stop();
        };
      });
    },
    { scope: root },
  );

  const row = (items: string[], tiles: boolean, hidden?: boolean) =>
    items.map((t, i) => (
      <span key={t} aria-hidden={hidden}>
        {t}
        {tiles ? <i style={{ background: projects[i % projects.length].color }} aria-hidden /> : <em aria-hidden>/</em>}
      </span>
    ));

  return (
    <div ref={root} className="ticker">
      <div className="ticker__track ticker__track--a" aria-label="Highlights">
        {row(highlights, true)}
        {row(highlights, true, true)}
      </div>
      <div className="ticker__track ticker__track--b" aria-label="Tech stack">
        {row(marquee, false)}
        {row(marquee, false, true)}
      </div>
    </div>
  );
}
