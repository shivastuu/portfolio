"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap";
import { marquee, projects } from "../lib/content";

// Big running line of the stack with little colour tiles between words (one per project colour).
// It drifts on its own, follows the scroll direction and speeds up with scroll velocity.
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const set = gsap.quickSetter(".ticker__track", "xPercent");
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
          x = wrap(x + dir * (1 + boost) * dt * 0.0025);
          boost *= 0.93;
          set(x);
        };
        gsap.ticker.add(tick);
        return () => {
          st.kill();
          gsap.ticker.remove(tick);
        };
      });
    },
    { scope: root },
  );

  const row = (hidden?: boolean) =>
    marquee.map((t, i) => (
      <span key={t} aria-hidden={hidden}>
        {t}
        <i style={{ background: projects[i % projects.length].color }} aria-hidden />
      </span>
    ));

  return (
    <div ref={root} className="ticker" aria-label="Tech stack">
      <div className="ticker__track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
