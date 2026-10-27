"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";

const HUES = [75, 185, 260, 320]; // lime, cyan, violet, pink
type Spark = { x: number; y: number; vx: number; vy: number; life: number; hue: number; r: number };

// Lens-flare cursor: comet tail, halo, flare ghosts mirrored through the screen centre, sparks.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(`(pointer: fine) and ${MOTION}`, () => {
      const el = dot.current!, cv = canvas.current!, ctx = cv.getContext("2d")!;
      const html = document.documentElement;
      const x = gsap.quickTo(el, "x", { duration: 0.15, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.15, ease: "power3" });
      const trail: { x: number; y: number }[] = [];
      const sparks: Spark[] = [];
      let mx = -999, my = -999, hx = mx, hy = my, t = 0, hovering = false;

      const resize = () => {
        const dpr = Math.min(devicePixelRatio, 2);
        cv.width = innerWidth * dpr;
        cv.height = innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const emit = (n: number, force: number) => {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, s = Math.random() * force;
          sparks.push({ x: mx, y: my, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hue: HUES[(Math.random() * HUES.length) | 0], r: 1 + Math.random() * 2.5 });
        }
      };
      const move = (e: PointerEvent) => {
        if (mx < -900) (hx = e.clientX), (hy = e.clientY); // no streak in from off-screen
        const dist = Math.hypot(e.clientX - mx, e.clientY - my);
        mx = e.clientX;
        my = e.clientY;
        x(mx);
        y(my);
        const over = !!(e.target as Element).closest("a, button");
        if (over && !hovering) emit(14, 3);
        hovering = over;
        el.classList.add("is-on");
        el.classList.toggle("is-hover", over);
        emit(Math.min(dist / 10, 3) | 0, 1.4);
      };
      const down = () => emit(40, 7);

      const glow = (px: number, py: number, r: number, hue: number, a: number) => {
        const g = ctx.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, `hsla(${hue},100%,72%,${a})`);
        g.addColorStop(0.6, `hsla(${hue},100%,72%,${a * 0.35})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const tick = () => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        if (mx < -900) return;
        t += 0.008;
        hx += (mx - hx) * 0.4;
        hy += (my - hy) * 0.4;
        trail.unshift({ x: hx, y: hy });
        if (trail.length > 28) trail.pop();
        const hue = 75 + ((Math.sin(t) + 1) / 2) * 245; // drifts lime → cyan → violet → pink
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const k = 1 - i / trail.length;
          ctx.strokeStyle = `hsla(${hue + i * 5},100%,65%,${k * 0.65})`;
          ctx.lineWidth = k * 14;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
        glow(hx, hy, 110, hue, 0.3);
        // Flare ghosts sit on the line from the cursor through the screen centre, like a camera lens.
        const cx = innerWidth / 2, cy = innerHeight / 2;
        for (const [k, r, h] of [[-0.3, 34, hue + 110], [-0.65, 16, hue + 200], [-1, 60, hue + 60], [0.45, 22, hue + 160]]) {
          glow(cx + (hx - cx) * k, cy + (hy - cy) * k, r, h, 0.16);
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.95;
          s.vy = s.vy * 0.95 + 0.05;
          s.life -= 0.02;
          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          ctx.fillStyle = `hsla(${s.hue},100%,70%,${s.life})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * s.life + 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
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
      <canvas ref={canvas} className="flare" aria-hidden />
      <div ref={dot} className="cursor" aria-hidden>
        <span />
      </div>
    </>
  );
}
