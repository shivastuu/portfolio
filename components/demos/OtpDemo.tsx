"use client";

import { useState } from "react";
import Demo from "./Demo";

const LEN = 6;

// The design system's OTP input, re-created: one real <input> (so paste, autofill and screen readers work),
// drawn as six boxes.
export default function OtpDemo() {
  const [v, setV] = useState("");
  const done = v.length === LEN;

  return (
    <Demo title="OTP input from the design system">
      <p className="demo__hint">Type or paste any six digits. Backspace and arrow keys work as usual.</p>
      <label className={`otp ${done ? "is-done" : ""}`}>
        <span className="sr-only">One-time code</span>
        <input
          value={v}
          onChange={(e) => setV(e.target.value.replace(/\D/g, "").slice(0, LEN))}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={LEN}
          spellCheck={false}
        />
        <span className="otp__boxes" aria-hidden>
          {Array.from({ length: LEN }, (_, i) => (
            <span key={i} className={i === v.length ? "is-next" : v[i] ? "is-full" : ""}>
              {v[i] ?? ""}
            </span>
          ))}
        </span>
      </label>
      <div className="demo__row">
        <p className={`demo__status ${done ? "is-ok" : ""}`} aria-live="polite">
          {done ? "✓ Code complete" : `${LEN - v.length} digit${LEN - v.length === 1 ? "" : "s"} to go`}
        </p>
        <button type="button" className="demo__btn demo__btn--ghost" onClick={() => setV("")}>
          Reset
        </button>
      </div>
    </Demo>
  );
}
