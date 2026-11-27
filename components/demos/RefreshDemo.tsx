"use client";

import { useEffect, useRef, useState } from "react";
import Demo from "./Demo";

type Step = { col: "a" | "s" | "b"; text: string; tone?: "ok" | "bad" | "wait" };

// Two tabs hit an expired token at the same moment. Refresh tokens rotate and a reused one revokes the session,
// so without coordination both tabs refresh with the same token and the user is logged out.
// With a Web Lock, one tab refreshes and the other waits, then finds the new token and skips its own refresh.
const WITHOUT: Step[] = [
  { col: "a", text: "GET /cards → 401, token expired" },
  { col: "b", text: "GET /cards → 401, token expired" },
  { col: "a", text: "POST /refresh with R1" },
  { col: "b", text: "POST /refresh with R1" },
  { col: "s", text: "R1 → R2, issued to tab A" },
  { col: "s", text: "R1 used twice → session revoked", tone: "bad" },
  { col: "a", text: "Logged out ✕", tone: "bad" },
  { col: "b", text: "Logged out ✕", tone: "bad" },
];
const WITH: Step[] = [
  { col: "a", text: "GET /cards → 401, token expired" },
  { col: "b", text: "GET /cards → 401, token expired" },
  { col: "a", text: "Takes lock “refresh”" },
  { col: "b", text: "Waits for lock…", tone: "wait" },
  { col: "a", text: "POST /refresh with R1" },
  { col: "s", text: "R1 → R2", tone: "ok" },
  { col: "a", text: "Releases lock · retry → 200 ✓", tone: "ok" },
  { col: "b", text: "Gets lock · token already fresh, skips refresh" },
  { col: "b", text: "Retry → 200 ✓", tone: "ok" },
];

export default function RefreshDemo() {
  const [locks, setLocks] = useState(true);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const steps = locks ? WITH : WITHOUT;

  useEffect(() => () => clearInterval(timer.current), []);

  const run = () => {
    clearInterval(timer.current);
    setShown(0);
    setRunning(true);
    let n = 0;
    timer.current = setInterval(() => {
      n++;
      setShown(n);
      if (n >= steps.length) {
        clearInterval(timer.current);
        setRunning(false);
      }
    }, 550);
  };
  const toggle = () => {
    clearInterval(timer.current);
    setRunning(false);
    setShown(0);
    setLocks(!locks);
  };

  const col = (c: Step["col"], label: string) => (
    <div className="rf__col">
      <p className="mono rf__label">{label}</p>
      <ol>
        {steps.slice(0, shown).map((s, i) =>
          s.col === c ? (
            <li key={i} className={`rf__step ${s.tone ? `is-${s.tone}` : ""}`}>
              {s.text}
            </li>
          ) : null,
        )}
      </ol>
    </div>
  );

  return (
    <Demo title="Token refresh across two tabs">
      <div className="demo__row">
        <button type="button" role="switch" aria-checked={locks} className={`switch ${locks ? "is-on" : ""}`} onClick={toggle}>
          <i aria-hidden /> Web Locks {locks ? "on" : "off"}
        </button>
        <button type="button" className="demo__btn" onClick={run} disabled={running}>
          {shown ? "Run again" : "Run"} ↻
        </button>
      </div>
      <div className="rf" aria-live="polite">
        {col("a", "Tab A")}
        {col("s", "Auth server")}
        {col("b", "Tab B")}
      </div>
    </Demo>
  );
}
