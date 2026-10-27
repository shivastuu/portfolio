"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

// Child drifts toward the pointer and springs back on leave.
export default function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const el = ref.current!;
      const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.35);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      };
      const leave = () => (x(0), y(0));
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    <div ref={ref} className="magnetic">
      {children}
    </div>
  );
}
