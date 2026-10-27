"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap";
import { marquee } from "../lib/content";

// Endless strip that follows scroll direction and speeds up with scroll velocity.
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const setX = gsap.quickSetter(".marquee__track", "xPercent");
        const wrap = gsap.utils.wrap(-50, 0);
        let x = 0, dir = -1, boost = 0;
        ScrollTrigger.create({
          onUpdate: (s) => {
            dir = s.direction === 1 ? -1 : 1;
            boost = Math.min(Math.abs(s.getVelocity()) / 300, 10);
          },
        });
        const tick = (_: number, dt: number) => {
          x = wrap(x + dir * (1 + boost) * dt * 0.003);
          boost *= 0.94;
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  const row = (hidden?: boolean) =>
    marquee.map((t) => (
      <span key={t} aria-hidden={hidden}>
        {t}
        <em aria-hidden>✦</em>
      </span>
    ));

  return (
    <div ref={root} className="marquee" aria-label="Tech stack">
      <div className="marquee__track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
