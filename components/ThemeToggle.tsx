"use client";

// Flips data-theme on <html> and remembers it; the boot script in app/layout.tsx re-applies it on load.
// The label is CSS-driven ("Dark" in light mode, "Light" in dark mode), so no React state is needed.
const flip = () => {
  const d = document.documentElement;
  const next = d.dataset.theme === "dark" ? "light" : "dark";
  d.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
};

export default function ThemeToggle() {
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label="Switch between light and dark mode">
      <span className="theme-toggle__dark">Dark</span>
      <span className="theme-toggle__light">Light</span>
    </button>
  );
}
