// Picks the saved or OS theme and, on the first home visit of a session, holds scroll for the hero preloader.
// Runs twice: inlined in <head> before first paint (app/layout.tsx), and again from <Boot /> after React mounts,
// because Netlify injects a comment into <head>, hydration fails, and React re-creates <html> without these.
// Must stay self-contained: it is serialised with toString() into the inline script.
export function boot() {
  const d = document.documentElement;
  let t: string | null = null;
  let s: string | null = null;
  try {
    t = localStorage.getItem("theme");
    s = sessionStorage.getItem("intro");
  } catch {}
  d.dataset.theme = t || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  if (location.pathname === "/" && !s) d.classList.add("is-loading");
}
