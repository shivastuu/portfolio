"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { askSuggestions, links, projects } from "../lib/content";

type Msg = { role: "user" | "model"; text: string; failed?: boolean };

const GREETING = "Hi! I'm Shivastu's portfolio assistant. Ask me anything about his work, projects, skills or resume.";
const OOPS = "Something went wrong. Please try again in a moment.";
// Case-study paths the AI mentions become links; unknown slugs stay plain text.
const CASE = new RegExp(`(/work/(?:${projects.map((p) => p.slug).join("|")}))`, "g");

// Floating "Ask AI about me" chat, mounted once in the layout so the conversation survives page changes.
// Answers come from /api/ask (netlify/functions/ask.mts).
export default function Ask() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => void log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }), [msgs, busy]);

  const ask = async (text: string) => {
    text = text.trim();
    if (!text || busy) return;
    const history: Msg[] = [...msgs, { role: "user", text }];
    setMsgs(history);
    setBusy(true);
    let reply: Msg;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Error notices stay on screen but are not sent back as conversation.
        body: JSON.stringify({ messages: history.filter((m) => !m.failed) }),
      });
      const data = await res.json().catch(() => ({}));
      reply = data.answer
        ? { role: "model", text: data.answer }
        : { role: "model", failed: true, text: res.status === 429 ? "Too many questions right now. Please try again in a minute." : OOPS };
    } catch {
      reply = { role: "model", failed: true, text: OOPS };
    }
    setMsgs([...history, reply]);
    setBusy(false);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ask(input.current!.value);
    input.current!.value = "";
  };

  const linkify = (t: string) => t.split(CASE).map((s, i) => (i % 2 ? <Link key={i} href={s}>{s}</Link> : s));

  return (
    <>
      {open && (
        <div className="ask" id="ask" role="dialog" aria-labelledby="ask-title">
          <div className="ask__head">
            <div>
              <h2 id="ask-title">Ask about Shivastu</h2>
              <p className="label">AI · answers from his portfolio &amp; resume</p>
            </div>
            <button type="button" className="ask__close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className="ask__log" ref={log} aria-live="polite" data-lenis-prevent>
            <p className="msg msg--model">{GREETING}</p>
            {msgs.length === 0 && (
              <div className="ask__suggest">
                {askSuggestions.map((s) => (
                  <button type="button" key={s} onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <p key={i} className={`msg msg--${m.role}`}>
                {m.role === "model" ? linkify(m.text) : m.text}
              </p>
            ))}
            {busy && (
              <p className="msg msg--model typing" aria-label="Thinking">
                <i /> <i /> <i />
              </p>
            )}
          </div>

          <form className="ask__form" onSubmit={submit}>
            <input ref={input} name="q" maxLength={500} placeholder="Ask about his work…" aria-label="Your question" autoComplete="off" />
            <button type="submit" disabled={busy}>
              Send
            </button>
          </form>
          <p className="ask__note">AI can get things wrong. For anything important, email {links.email}.</p>
        </div>
      )}
      <button type="button" className="ask-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="ask" aria-label={open ? "Close chat" : "Ask AI about Shivastu"}>
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.6" />
          </svg>
        )}
      </button>
      {!open && (
        // CSS fades this in after a few seconds, then out (and on hover of the button above, which is the accessible control).
        <button type="button" className="ask-teaser" onClick={() => setOpen(true)} tabIndex={-1} aria-hidden>
          👋 Ask me about Shivastu
        </button>
      )}
    </>
  );
}
