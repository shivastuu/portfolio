"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const el = ref.current!;
      const html = document.documentElement;
      const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        el.classList.add("is-on");
        el.classList.toggle("is-hover", !!(e.target as Element).closest("a, button"));
      };
      html.classList.add("has-cursor");
      addEventListener("pointermove", move);
      return () => {
        html.classList.remove("has-cursor");
        removeEventListener("pointermove", move);
      };
    });
  });

  return (
    <div ref={ref} className="cursor" aria-hidden>
      <span />
    </div>
  );
}
