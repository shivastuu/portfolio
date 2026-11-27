"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

// A small dot that follows the pointer. Over anything with data-cursor="Label" it grows into a pill showing that label.
// Over a data-metal area it also moves the card's light (--mx / --my) and tilts it a little (--rx / --ry).
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const c = el.current!;
      const x = gsap.quickTo(c, "x", { duration: 0.35, ease: "power3" });
      const y = gsap.quickTo(c, "y", { duration: 0.35, ease: "power3" });
      let metal: HTMLElement | null = null;
      const light = (e: PointerEvent) => {
        const m = (e.target as Element).closest<HTMLElement>("[data-metal]");
        if (metal && metal !== m) for (const v of ["--mx", "--my", "--rx", "--ry"]) metal.style.removeProperty(v);
        metal = m;
        if (!m) return;
        const r = m.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        m.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        m.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        m.style.setProperty("--rx", `${((0.5 - py) * 14).toFixed(2)}deg`);
        m.style.setProperty("--ry", `${((px - 0.5) * 18).toFixed(2)}deg`);
      };
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        light(e);
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
