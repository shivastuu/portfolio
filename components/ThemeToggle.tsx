"use client";

// Flips data-theme on <html> and remembers it; the boot script in app/layout.tsx re-applies it on load.
// CSS shows the sun in dark mode and the moon in light mode, so no React state is needed.
const flip = () => {
  const d = document.documentElement;
  const next = d.dataset.theme === "light" ? "dark" : "light";
  d.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
};

export default function ThemeToggle() {
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label="Switch between light and dark mode" title="Light / dark mode">
      <svg className="theme-toggle__sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="theme-toggle__moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
