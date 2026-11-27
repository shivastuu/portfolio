"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

// A small dot that follows the pointer. Over anything with data-cursor="Label" it grows into a pill showing that label.
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const c = el.current!;
      const x = gsap.quickTo(c, "x", { duration: 0.35, ease: "power3" });
      const y = gsap.quickTo(c, "y", { duration: 0.35, ease: "power3" });
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        c.classList.add("is-on");
        const t = (e.target as Element).closest<HTMLElement>("[data-cursor]");
        const text = t?.dataset.cursor ?? "";
        if (label.current!.textContent !== text) label.current!.textContent = text;
        c.classList.toggle("is-label", !!text);
        c.classList.toggle("is-link", !text && !!(e.target as Element).closest("a, button"));
      };
      const leave = () => c.classList.remove("is-on");
      document.documentElement.classList.add("has-cursor");
      addEventListener("pointermove", move);
      document.addEventListener("pointerleave", leave);
      return () => {
        document.documentElement.classList.remove("has-cursor");
        removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", leave);
      };
    });
  });

  return (
    <div ref={el} className="cursor" aria-hidden>
      <span ref={label} />
    </div>
  );
}
