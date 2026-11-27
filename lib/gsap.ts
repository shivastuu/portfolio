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
