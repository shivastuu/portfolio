"use client";

import { useEffect, useRef, useState } from "react";
import Demo from "./Demo";

type Outcome = "success" | "failed" | "unknown";
type Phase = "idle" | "paying" | "polling" | "paid" | "failed" | "pending";
const MAX = 15;

// In-app bill payment's result screen, re-created. A payment the app can't confirm never reads as "failed"
// (the user might pay twice): unknown results show "in process" and poll every 30 s, up to 15 times, then settle on pending.
export default function BillDemo() {
  const [outcome, setOutcome] = useState<Outcome>("unknown");
  const [phase, setPhase] = useState<Phase>("idle");
  const [tries, setTries] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const pay = () => {
    clearTimeout(timer.current);
    setTries(0);
    setPhase("paying");
    timer.current = setTimeout(() => {
      if (outcome === "success") return setPhase("paid");
      if (outcome === "failed") return setPhase("failed");
      setPhase("polling");
      let n = 0;
      const poll = () => {
        n++;
        setTries(n);
        if (n >= MAX) return setPhase("pending");
        timer.current = setTimeout(poll, 260);
      };
      timer.current = setTimeout(poll, 260);
    }, 900);
  };

  const screen: Record<Phase, { icon: string; title: string; text: string; tone: string }> = {
    idle: { icon: "₹", title: "₹2,140", text: "Electricity bill · due in 3 days", tone: "" },
    paying: { icon: "…", title: "Paying…", text: "Talking to the bank", tone: "" },
    polling: { icon: "⟳", title: "In process", text: `Checking with the bank · ${tries}/${MAX}`, tone: "wait" },
    paid: { icon: "✓", title: "Paid", text: "₹2,140 paid to BESCOM", tone: "ok" },
    failed: { icon: "✕", title: "Payment failed", text: "The bank declined it. No money was taken.", tone: "bad" },
    pending: { icon: "◷", title: "Pending", text: "We'll update you. Please don't pay again.", tone: "wait" },
  };
  const s = screen[phase];
  const busy = phase === "paying" || phase === "polling";

  return (
    <Demo title="Bill payment that never shows a false “failed”">
      <div className="bill">
        <fieldset className="bill__pick" disabled={busy}>
          <legend className="mono">The bank answers with</legend>
          {(
            [
              ["success", "Success"],
              ["failed", "A clear failure"],
              ["unknown", "No clear answer"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className={outcome === k ? "is-on" : ""}>
              <input type="radio" name="bill-outcome" checked={outcome === k} onChange={() => setOutcome(k)} />
              {label}
            </label>
          ))}
          <button type="button" className="demo__btn" onClick={pay} disabled={busy}>
            {phase === "idle" ? "Pay ₹2,140" : "Pay again"}
          </button>
          <p className="demo__hint">Each 30-second status check is sped up to a quarter of a second.</p>
        </fieldset>
        <div className={`bill__screen is-${s.tone}`} aria-live="polite">
          <span className={`bill__icon ${phase === "polling" ? "is-spin" : ""}`} aria-hidden>
            {s.icon}
          </span>
          <p className="bill__title">{s.title}</p>
          <p className="bill__text">{s.text}</p>
          {phase === "polling" && (
            <span className="bill__bar" aria-hidden>
              <i style={{ width: `${(tries / MAX) * 100}%` }} />
            </span>
          )}
        </div>
      </div>
    </Demo>
  );
}
