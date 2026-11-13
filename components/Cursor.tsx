"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

const HUES = [75, 185, 260, 320]; // lime, cyan, violet, pink
type Spark = { x: number; y: number; vx: number; vy: number; life: number; hue: number };

// Small dot that follows the pointer and opens into a ring over links; a click throws a small ring of sparks.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const el = dot.current!, cv = canvas.current!, ctx = cv.getContext("2d")!;
      const html = document.documentElement;
      const x = gsap.quickTo(el, "x", { duration: 0.08, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.08, ease: "power3" });
      const sparks: Spark[] = [];
      let live = false;

      const resize = () => {
        const dpr = Math.min(devicePixelRatio, 2);
        cv.width = innerWidth * dpr;
        cv.height = innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        el.classList.add("is-on");
        el.classList.toggle("is-hover", !!(e.target as Element).closest("a, button"));
      };
      const down = (e: PointerEvent) => {
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2, s = 1.5 + Math.random();
          sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue: HUES[i % HUES.length] });
        }
        live = true;
      };
      // Draws only while sparks are alive; the last tick clears the canvas.
      const tick = () => {
        if (!live) return;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.9;
          s.vy *= 0.9;
          s.life -= 0.045;
          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          ctx.fillStyle = `hsla(${s.hue},100%,62%,${s.life})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2 * s.life + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        live = sparks.length > 0;
      };

      resize();
      html.classList.add("has-cursor");
      addEventListener("resize", resize);
      addEventListener("pointermove", move);
      addEventListener("pointerdown", down);
      gsap.ticker.add(tick);
      return () => {
        html.classList.remove("has-cursor");
        removeEventListener("resize", resize);
        removeEventListener("pointermove", move);
        removeEventListener("pointerdown", down);
        gsap.ticker.remove(tick);
      };
    });
  });

  return (
    <>
      <canvas ref={canvas} className="sparks" aria-hidden />
      <div ref={dot} className="cursor" aria-hidden>
        <span />
      </div>
    </>
  );
}
