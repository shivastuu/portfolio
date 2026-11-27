import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Every animation runs only under this query; reduced-motion users get the static page.
export const MOTION = "(prefers-reduced-motion: no-preference)";

// Runs setup() once el comes within a screen of the viewport, so off-screen sections cost nothing at start-up.
// Wrap setup in contextSafe (from gsap.matchMedia's callback) so its animations are cleaned up with the component.
// (Typed as Function because that is what GSAP's contextSafe returns.)
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function whenNear(el: Element, setup: Function) {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setup();
    },
    { rootMargin: "100% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}

export { gsap, ScrollTrigger, useGSAP };

// Runs fn on the visitor's first scroll, touch, click or key press (at once if the page is already scrolled), so
// set-up for sections just below the fold stays out of the first load. Returns a function that cancels it.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function onFirstMove(fn: Function) {
  const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"];
  const off = () => events.forEach((e) => removeEventListener(e, go));
  const go = () => {
    off();
    fn();
  };
  if (scrollY > 0) fn();
  else events.forEach((e) => addEventListener(e, go, { passive: true }));
  return off;
}
