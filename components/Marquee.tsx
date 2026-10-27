"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap";
import { marquee, domains } from "../lib/content";

// Two endless rows running opposite ways; they follow scroll direction, speed up and skew with velocity.
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const setA = gsap.quickSetter(".marquee__track--a", "xPercent");
        const setB = gsap.quickSetter(".marquee__track--b", "xPercent");
        const skew = gsap.quickTo(".marquee__track", "skewX", { duration: 0.4, ease: "power3" });
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
          setA(x);
          setB(-50 - x);
          skew(dir * boost * 1.2);
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  const row = (items: string[], hidden?: boolean) =>
    items.map((t) => (
      <span key={t} aria-hidden={hidden}>
        {t}
        <em aria-hidden>✦</em>
      </span>
    ));

  return (
    <div ref={root} className="marquee" aria-label="Tech stack and domains">
      <div className="marquee__track marquee__track--a">
        {row(marquee)}
        {row(marquee, true)}
      </div>
      <div className="marquee__track marquee__track--b">
        {row(domains)}
        {row(domains, true)}
      </div>
    </div>
  );
}
