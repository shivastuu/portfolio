// Applies the saved theme (light by default) before first paint.
// Runs twice: inlined in <head> (app/layout.tsx), and again from <Boot /> after React mounts,
// because Netlify injects a comment into <head>, hydration fails, and React re-creates <html> without it.
// Must stay self-contained: it is serialised with toString() into the inline script.
export function boot() {
  let t: string | null = null;
  try {
    t = localStorage.getItem("theme");
  } catch {}
  document.documentElement.dataset.theme = t === "dark" ? "dark" : "light";
}
