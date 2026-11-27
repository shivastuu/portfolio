"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { links, projects } from "../lib/content";
import { copy, switchTheme } from "../lib/theme";

type Item = { id: string; group: string; label: string; hint?: string; keys?: string; run: () => void | Promise<void> };

// ⌘K / Ctrl+K command palette: jump to a section or case study, copy the email, switch the theme, open the AI chat.
// A combobox with a listbox (arrow keys, Enter, Escape), opened from the keyboard or the nav's ⌘K button ("palette:open").
export default function Palette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [note, setNote] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const back = useRef<HTMLElement | null>(null);
  const path = usePathname();

  const close = () => {
    setOpen(false);
    back.current?.focus();
  };
  const go = (id: string) => {
    if (path === "/") document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    else navigate(`/#${id}`);
  };

  const items = useMemo<Item[]>(
    () => [
      ...[
        ["work", "Selected work"],
        ["about", "About"],
        ["open-source", "Open source"],
        ["experience", "Experience"],
        ["contact", "Contact"],
      ].map(([id, label]) => ({ id: `s-${id}`, group: "Go to", label, run: () => go(id) })),
      ...projects.map((p) => ({ id: `p-${p.slug}`, group: "Case studies", label: p.title, hint: p.kind, keys: p.stack.join(" "), run: () => navigate(`/work/${p.slug}`) })),
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        hint: links.email,
        run: async () => setNote((await copy(links.email)) ? `Copied ${links.email}` : `Couldn't copy. The address is ${links.email}`),
      },
      { id: "theme", group: "Actions", label: "Switch light / dark", keys: "theme dark mode light", run: () => switchTheme() },
      { id: "ask", group: "Actions", label: "Ask the AI about me", keys: "chat assistant", run: () => dispatchEvent(new Event("ask:open")) },
      { id: "mail", group: "Links", label: "Email me", hint: links.email, run: () => void (location.href = `mailto:${links.email}`) },
      { id: "gh", group: "Links", label: "GitHub", hint: "github.com/shivastuu", run: () => void open_(links.github) },
      { id: "in", group: "Links", label: "LinkedIn", run: () => void open_(links.linkedin) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path],
  );

  // Ranked: label starts with the query, then a word in the label does, then any other match.
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    const rank = (i: Item) => {
      const l = i.label.toLowerCase();
      if (l.startsWith(t)) return 0;
      if (l.split(/[\s&/·-]+/).some((w) => w.startsWith(t))) return 1;
      if (l.includes(t)) return 2;
      return `${i.hint ?? ""} ${i.keys ?? ""} ${i.group}`.toLowerCase().includes(t) ? 3 : -1;
    };
    return items
      .map((i) => [i, rank(i)] as const)
      .filter(([, r]) => r >= 0)
      .sort((a, b) => a[1] - b[1])
      .map(([i]) => i);
  }, [q, items]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const ext = () => setOpen(true);
    addEventListener("keydown", key);
    addEventListener("palette:open", ext);
    return () => {
      removeEventListener("keydown", key);
      removeEventListener("palette:open", ext);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement as HTMLElement;
    setQ("");
    setActive(0);
    setNote("");
    requestAnimationFrame(() => input.current?.focus());
  }, [open]);
  useEffect(() => {
    setActive(0);
  }, [q]);
  useEffect(() => {
    document.getElementById(`cmd-${shown[active]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [active, shown]);

  if (!open) return null;

  const pick = async (i: Item | undefined) => {
    if (!i) return;
    await i.run();
    if (i.id !== "copy") close();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => (a + 1) % Math.max(shown.length, 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => (a - 1 + shown.length) % Math.max(shown.length, 1)));
    else if (e.key === "Enter") (e.preventDefault(), pick(shown[active]));
    else if (e.key === "Escape") (e.preventDefault(), close());
  };

  let last = "";
  return (
    <div className="cmd" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="cmd__box glass" role="dialog" aria-modal="true" aria-label="Command menu">
        <div className="cmd__search">
          <span className="mono" aria-hidden>
            ⌘K
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Jump to a project, copy email, switch theme…"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={shown[active] ? `cmd-${shown[active].id}` : undefined}
            aria-label="Search commands"
            autoComplete="off"
          />
          <kbd className="mono">Esc</kbd>
        </div>
        <ul id="cmd-list" className="cmd__list" role="listbox" aria-label="Commands" data-lenis-prevent>
          {shown.map((i, n) => {
            const head = !q.trim() && i.group !== last ? (last = i.group) : null;
            return (
              <li key={i.id} role="presentation">
                {head && (
                  <p className="cmd__group mono" aria-hidden>
                    {head}
                  </p>
                )}
                <div
                  id={`cmd-${i.id}`}
                  role="option"
                  aria-selected={n === active}
                  className={`cmd__item ${n === active ? "is-active" : ""}`}
                  onMouseMove={() => setActive(n)}
                  onClick={() => pick(i)}
                >
                  <span>{i.label}</span>
                  {(i.hint || q.trim()) && <span className="cmd__hint">{i.hint ?? i.group}</span>}
                </div>
              </li>
            );
          })}
          {!shown.length && <li className="cmd__empty">Nothing matches “{q}”.</li>}
        </ul>
        <p className="cmd__foot mono" aria-live="polite">
          {note || "↑↓ to move · Enter to open · Esc to close"}
        </p>
      </div>
    </div>
  );
}

const open_ = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
// Page changes go through the colour wipe (components/Wipe.tsx).
const navigate = (href: string) => dispatchEvent(new CustomEvent("wipe:go", { detail: href }));
