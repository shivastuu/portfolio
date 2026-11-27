"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { openSource } from "../lib/content";

// Open-source work as pull-request cards, with the Storybook star count as the big number.
export default function OpenSource() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from(".oss__card", { y: 90, rotate: (i) => [-4, 2, -2][i % 3], autoAlpha: 0, duration: 1.3, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".oss__cards", start: "top 82%" } });
        gsap.from(".oss__stars span", { yPercent: 100, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".oss__stars", start: "top 85%" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="oss" id="open-source">
      <div className="oss__head">
        <p className="mono">[05] Open source</p>
        <h2 className="oss__title">
          Shipped
          <br />
          upstream
        </h2>
        <div className="oss__side">
          <p className="oss__stars" aria-label="Storybook has more than 90 thousand GitHub stars">
            <span>90K★</span>
          </p>
          <p className="oss__note">
            Contributor to Storybook, the UI component workshop with 90k+ GitHub stars. One fix merged upstream, one feature in review.
          </p>
        </div>
      </div>

      <ul className="oss__cards">
        {openSource.map((o) => (
          <li key={o.title} className="oss__card">
            <a href={o.href} target="_blank" rel="noreferrer" data-cursor="GitHub ↗">
              <p className="oss__repo mono">
                <span>{o.repo}</span>
                <span>{o.about}</span>
              </p>
              <span className={`oss__state oss__state--${o.state.toLowerCase()}`}>
                <i aria-hidden /> {o.state}
              </span>
              <h3 className="oss__name">{o.title}</h3>
              <p className="oss__text">{o.text}</p>
              <ul className="tags">
                {o.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
