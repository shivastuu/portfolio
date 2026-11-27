"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { hero, links } from "../lib/content";
import { copy } from "../lib/theme";

const ITEMS = [
  ["moksha", "Moksha UI"],
  ["work", "Work"],
  ["about", "About"],
  ["open-source", "Open source"],
  ["experience", "Experience"],
  ["contact", "Contact"],
];

// Phones: a "Menu" button that opens a full-screen glass menu with big links that rise in one after another.
// home: same-page anchors; elsewhere the links go back to the home sections.
// The panel is portalled to <body>: inside the frosted nav, backdrop-filter would trap a fixed overlay in the nav's box.
export default function MobileMenu({ home }: { home: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), btn.current?.focus());
    addEventListener("keydown", esc);
    document.documentElement.classList.add("menu-open");
    return () => {
      removeEventListener("keydown", esc);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <button ref={btn} type="button" className="menu-btn mono" aria-expanded={open} aria-controls="mmenu" onClick={() => setOpen(!open)}>
        <span className="menu-btn__icon" aria-hidden>
          <i />
          <i />
        </span>
        {open ? "Close" : "Menu"}
      </button>
      {mounted &&
        createPortal(
          <div id="mmenu" className={`mmenu ${open ? "is-open" : ""}`} hidden={!open}>
            <nav aria-label="Menu">
              <ol>
                {ITEMS.map(([id, label], i) => (
                  <li key={id} style={{ "--i": i } as React.CSSProperties}>
                    <a href={home ? `#${id}` : `/#${id}`} onClick={() => setOpen(false)}>
                      <span className="mono">0{i + 1}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mmenu__foot" style={{ "--i": ITEMS.length } as React.CSSProperties}>
              <p className="mmenu__status">
                <span className="dot" aria-hidden /> {hero.status}
              </p>
              <button type="button" className="mmenu__mail" onClick={async () => setCopied(await copy(links.email))}>
                {copied ? "Copied ✓" : links.email}
              </button>
              <p className="mono">
                <a href={links.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>{" "}
                ·{" "}
                <a href={links.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
