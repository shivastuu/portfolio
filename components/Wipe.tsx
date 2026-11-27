"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { projects } from "../lib/content";

// Page transition: clicking a link to another page wipes a panel up in that project's colour (ink for other pages),
// showing the destination's name; the new page loads underneath and the panel lifts away.
// Only plain left-clicks on same-site links to a different page; back/forward and reduced motion skip it.
export default function Wipe() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pending = useRef(false);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const go = (url: URL) => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || url.pathname === location.pathname) return router.push(url.pathname + url.hash);
      const slug = url.pathname.match(/^\/work\/([^/.]+)/)?.[1];
      const p = projects.find((x) => x.slug === slug);
      gsap.set(el.current, { "--c": p?.color ?? "#0e0e0e", "--on": p?.on ?? "#f2f1ee", yPercent: 100, display: "grid" });
      label.current!.textContent = p?.title ?? "Shivastu Shrivastava";
      pending.current = true;
      gsap.to(el.current, { yPercent: 0, duration: 0.6, ease: "expo.inOut", onComplete: () => router.push(url.pathname + url.hash) });
    };
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      go(url);
    };
    // The command palette asks for page changes with this event.
    const fromPalette = (e: Event) => go(new URL((e as CustomEvent<string>).detail, location.href));
    document.addEventListener("click", click, true);
    addEventListener("wipe:go", fromPalette);
    return () => {
      document.removeEventListener("click", click, true);
      removeEventListener("wipe:go", fromPalette);
    };
  }, [router]);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    if (!location.hash) scrollTo(0, 0);
    gsap.to(el.current, { yPercent: -100, duration: 0.7, ease: "expo.inOut", delay: 0.15, onComplete: () => void gsap.set(el.current, { display: "none" }) });
  }, [path]);

  return (
    <div ref={el} className="wipe" aria-hidden>
      <span ref={label} className="wipe__label" />
    </div>
  );
}
