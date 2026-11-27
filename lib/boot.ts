// Runs before first paint, inlined in <head> (app/layout.tsx), and again from <Boot /> after React mounts,
// because Netlify injects a comment into <head>, hydration fails, and React re-creates <html> without these classes.
// - "motion": the visitor allows animation, so CSS starts animated elements in their "before" state.
// - "is-loading": the first home visit of a session plays the preloader.
// Must stay self-contained: it is serialised with toString() into the inline script.
export function boot() {
  const d = document.documentElement;
  let seen: string | null = null;
  try {
    seen = sessionStorage.getItem("intro");
  } catch {}
  if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    d.classList.add("motion");
    if (location.pathname === "/" && !seen) d.classList.add("is-loading");
  }
}
