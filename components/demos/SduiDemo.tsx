"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Demo from "./Demo";

type Section = { id: string; label: string; color: string; h: number };
// Placeholder sections: the real app has 13 section types; these six stand in for them.
const START: Section[] = [
  { id: "banner", label: "Banner", color: "#1d3a8a", h: 64 },
  { id: "actions", label: "Quick actions", color: "#d4a24c", h: 40 },
  { id: "card", label: "Card", color: "#17181b", h: 52 },
  { id: "offers", label: "Offers", color: "#e9dcc6", h: 40 },
  { id: "bills", label: "Bills", color: "#0e6b4f", h: 40 },
  { id: "rewards", label: "Rewards", color: "#c83223", h: 34 },
];

// Server-driven home screen, re-created: the "CMS" decides which sections render and in what order, and the
// phone follows without an app release. A broken CMS document falls back to the layout bundled in the app.
export default function SduiDemo() {
  const [order, setOrder] = useState(START);
  const [broken, setBroken] = useState(false);
  const phone = useRef<HTMLDivElement>(null);
  const rects = useRef(new Map<string, DOMRect>());

  // FLIP: remember where each section was, and after the reorder slide it from there.
  const remember = () => phone.current?.querySelectorAll<HTMLElement>("[data-id]").forEach((el) => rects.current.set(el.dataset.id!, el.getBoundingClientRect()));
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    phone.current?.querySelectorAll<HTMLElement>("[data-id]").forEach((el) => {
      const before = rects.current.get(el.dataset.id!);
      if (!before) return;
      const dy = before.top - el.getBoundingClientRect().top;
      if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    });
  }, [order, broken]);

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    remember();
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  const shown = broken ? START : order;

  return (
    <Demo title="Server-driven home screen">
      <div className="sdui">
        <div className="sdui__cms">
          <p className="mono">CMS layout</p>
          <ol>
            {order.map((s, i) => (
              <li key={s.id}>
                <i style={{ background: s.color }} aria-hidden />
                <span>{s.label}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || broken} aria-label={`Move ${s.label} up`}>
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1 || broken} aria-label={`Move ${s.label} down`}>
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            role="switch"
            aria-checked={broken}
            className={`switch ${broken ? "is-on is-bad" : ""}`}
            onClick={() => {
              remember();
              setBroken(!broken);
            }}
          >
            <i aria-hidden /> Break the CMS document
          </button>
          <p className="demo__hint">Sections are placeholders; the real app has 13.</p>
        </div>
        <div className="sdui__phone" ref={phone} aria-live="polite">
          <p className="sdui__bar">
            <span>Home</span>
            {broken && <span className="sdui__flag">Bundled fallback</span>}
          </p>
          {shown.map((s) => (
            <div key={s.id} data-id={s.id} className="sdui__sec" style={{ background: s.color, height: s.h }}>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Demo>
  );
}
