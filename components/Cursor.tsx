"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

const HUES = [75, 185, 260, 320]; // lime, cyan, violet, pink
type Spark = { x: number; y: number; vx: number; vy: number; life: number; hue: number };

// Dot on the pointer plus a thin ring that lags behind and stretches toward the movement (no trail);
// the ring grows over links, and a click throws a small ring of sparks.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const el = dot.current!, rg = ring.current!, cv = canvas.current!, ctx = cv.getContext("2d")!;
      const html = document.documentElement;
      const x = gsap.quickTo(el, "x", { duration: 0.08, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.08, ease: "power3" });
      const rx = gsap.quickTo(rg, "x", { duration: 0.45, ease: "power3" });
      const ry = gsap.quickTo(rg, "y", { duration: 0.45, ease: "power3" });
      const shape = rg.firstElementChild!;
      const sparks: Spark[] = [];
      let live = false, mx = 0, my = 0;

      const resize = () => {
        const dpr = Math.min(devicePixelRatio, 2);
        cv.width = innerWidth * dpr;
        cv.height = innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const move = (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY;
        x(mx);
        y(my);
        rx(mx);
        ry(my);
        const over = !!(e.target as Element).closest("a, button");
        for (const c of [el, rg]) {
          c.classList.add("is-on");
          c.classList.toggle("is-hover", over);
        }
      };
      // The further the ring lags, the more it stretches along the direction of travel.
      const stretch = () => {
        const dx = mx - (gsap.getProperty(rg, "x") as number), dy = my - (gsap.getProperty(rg, "y") as number);
        const k = Math.min(Math.hypot(dx, dy) / 160, 0.4);
        gsap.set(shape, { rotation: (Math.atan2(dy, dx) * 180) / Math.PI, scaleX: 1 + k, scaleY: 1 - k * 0.5 });
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
      gsap.ticker.add(stretch);
      return () => {
        html.classList.remove("has-cursor");
        removeEventListener("resize", resize);
        removeEventListener("pointermove", move);
        removeEventListener("pointerdown", down);
        gsap.ticker.remove(tick);
        gsap.ticker.remove(stretch);
      };
    });
  });

  return (
    <>
      <canvas ref={canvas} className="sparks" aria-hidden />
      <div ref={ring} className="cursor cursor--ring" aria-hidden>
        <span />
      </div>
      <div ref={dot} className="cursor" aria-hidden>
        <span />
      </div>
    </>
  );
}
