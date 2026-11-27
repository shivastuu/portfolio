const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>";

// Decodes an element's text from random glyphs, left to right (the Mondragon-style label effect).
// The final text is the element's own text, so screen readers and no-JS visitors always get the real words.
export function scramble(el: HTMLElement, duration = 900) {
  const text = el.dataset.text ?? (el.dataset.text = el.textContent ?? "");
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const fixed = Math.floor(t * text.length);
    let out = text.slice(0, fixed);
    for (let i = fixed; i < text.length; i++) out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    el.textContent = out;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
