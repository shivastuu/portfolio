// Switches light/dark and remembers it. Where the browser supports view transitions, the new theme spreads as a
// circle from (x, y), normally the button that was pressed. Used by the nav toggle and the command palette.
export function switchTheme(x = innerWidth / 2, y = innerHeight / 2) {
  const d = document.documentElement;
  const next = d.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    d.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  if (!("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() =>
    d.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
    ),
  );
}

// Copies text and reports whether it worked (clipboard access can be refused).
export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
