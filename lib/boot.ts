// Runs before first paint, inlined in <head> (app/layout.tsx), and again from <Boot /> after React mounts,
// because Netlify injects a comment into <head>, hydration fails, and React re-creates <html> without these classes.
// - "motion": the visitor allows animation, so CSS starts animated elements in their "before" state.
// - "is-loading": the first home visit of a session on a large screen plays the preloader (phones skip it: it would delay first paint).
// - data-theme: the saved choice, else the system setting.
// Must stay self-contained: it is serialised with toString() into the inline script.
export function boot() {
  const d = document.documentElement;
  let seen: string | null = null, theme: string | null = null;
  try {
    seen = sessionStorage.getItem("intro");
    theme = localStorage.getItem("theme");
  } catch {}
  d.dataset.theme = theme === "dark" || theme === "light" ? theme : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    d.classList.add("motion");
    if (location.pathname === "/" && !seen && matchMedia("(min-width: 900px)").matches) d.classList.add("is-loading");
  }
}
