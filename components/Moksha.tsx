"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION, whenNear, onFirstMove } from "../lib/gsap";
import { moksha } from "../lib/content";
import { copy } from "../lib/theme";

// Moksha UI, my open-source design system, right after the hero: for anyone who wants to see the design work
// before reading case studies. The heading and facts are static HTML; the lab (the three.js prism and live
// Moksha screens, about 1 MB of JS) loads only once the section is close, so it costs the first paint nothing.
const Lab = dynamic(() => import("./MokshaLab"), { ssr: false, loading: () => <Poster /> });

function Poster() {
  return <div className="mk__poster" aria-hidden />;
}

export default function Moksha() {
  const root = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [brand, setBrand] = useState(moksha.swatches[0].hex);
  const [copied, setCopied] = useState(false);

  // Load the lab once the section is within half a screen AND the visitor has scrolled or touched the page. On
  // phones the section starts right under the hero, so "near" alone would pull three.js into the first load.
  useEffect(() => {
    let near = false;
    let moved = scrollY > 0;
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    const stop = () => {
      io.disconnect();
      events.forEach((e) => removeEventListener(e, onMove));
    };
    const go = () => {
      if (!near || !moved) return;
      stop();
      setNear(true);
    };
    const onMove = () => {
      moved = true;
      go();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting;
        go();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(root.current!);
    events.forEach((e) => addEventListener(e, onMove, { passive: true }));
    return stop;
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, (_ctx, contextSafe) => {
        let off = () => {};
        const stop = whenNear(root.current!, () => (off = onFirstMove(contextSafe!(() => {
          gsap.from(".mk__title .line > span", { yPercent: 105, duration: 1.3, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: ".mk__head", start: "top 78%" } });
          gsap.from(".mk__beam", { scaleX: 0, duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".mk__head", start: "top 70%" } });
          gsap.from(".mk__intro > *", { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".mk__head", start: "top 70%" } });
          gsap.from(".mk__lab", { y: 80, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".mk__lab", start: "top 88%" } });
          gsap.from(".mk__fact", { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".mk__facts", start: "top 88%" } });
        }))));
        return () => {
          stop();
          off();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mk" id="moksha" style={{ "--brand": brand } as CSSProperties}>
      <div className="mk__glow" aria-hidden />
      <div className="mk__head">
        <p className="mono mk__label">
          <span>[02] Open-source design system</span>
          <span>@moksha-ui/core · MIT · React + React Native</span>
        </p>
        <h2 className="mk__title">
          <span className="line">
            <span>Moksha</span>
          </span>
          <span className="line">
            <span>
              UI<i className="mk__dot" aria-hidden />
            </span>
          </span>
        </h2>
        <div className="mk__intro">
          <p className="mk__line">{moksha.line}</p>
          <p className="mk__pitch">{moksha.pitch}</p>
          <div className="mk__links">
            <a className="mk__btn" href={moksha.github} target="_blank" rel="noreferrer" data-cursor="GitHub ↗">
              Code on GitHub ↗
            </a>
            <a className="mk__btn mk__btn--ghost" href={moksha.npm} target="_blank" rel="noreferrer" data-cursor="npm ↗">
              npm ↗
            </a>
          </div>
          <button type="button" className="mk__install mono" onClick={async () => setCopied(await copy(moksha.install))} aria-live="polite">
            <span aria-hidden>$</span> {copied ? "Copied to clipboard" : moksha.install}
          </button>
        </div>
        <i className="mk__beam" aria-hidden />
      </div>

      <div className="mk__lab">{near ? <Lab brand={brand} onBrand={setBrand} /> : <Poster />}</div>

      <ul className="mk__facts">
        {moksha.facts.map((f, i) => (
          <li key={f.k} className="mk__fact">
            <span className="mono">0{i + 1}</span>
            <h3>{f.k}</h3>
            <p>{f.v}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
