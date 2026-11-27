"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { hero, links } from "../lib/content";
import { useClock } from "../lib/useClock";
import Shader from "./Shader";

const RING = "LET'S BUILD SOMETHING THAT SHIPS · SAY HELLO · ";

// Closing section on a flowing colour field: letters fly in and settle into a slowly turning ring
// around the email button, and the name sits huge at the bottom.
export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const time = useClock();

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from(".ring__ch", {
          x: () => gsap.utils.random(-260, 260),
          y: () => gsap.utils.random(-200, 200),
          rotate: () => gsap.utils.random(-180, 180),
          autoAlpha: 0,
          duration: 1.6,
          ease: "expo.out",
          stagger: { each: 0.012, from: "random" },
          scrollTrigger: { trigger: ".ring", start: "top 80%" },
        });
        gsap.from(".contact__name .line > span", { yPercent: 105, duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".contact__name", start: "top 95%" } });
      });
    },
    { scope: root },
  );

  const chars = [...RING];
  return (
    <section ref={root} className="contact" id="contact">
      <Shader className="contact__gl" />
      <div className="contact__top mono">
        <span>[07] Contact</span>
        <span>
          <span className="dot" aria-hidden /> {hero.status}
        </span>
      </div>

      <div className="ring">
        <div className="ring__text" aria-hidden>
          {chars.map((c, i) => (
            <span key={i} className="ring__ch" style={{ transform: `rotate(${(i * 360) / chars.length}deg)` }}>
              {c}
            </span>
          ))}
        </div>
        <a href={`mailto:${links.email}`} className="ring__btn" data-cursor="Email">
          <span>Say hello</span>
          <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="contact__bottom">
        <p className="contact__name" aria-label="Shivastu Shrivastava">
          <span className="line">
            <span>Shivastu</span>
          </span>
          <span className="line">
            <span>Shrivastava</span>
          </span>
        </p>
        <ul className="contact__links">
          <li>
            <a href={`mailto:${links.email}`}>{links.email}</a>
          </li>
          <li>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </li>
          <li>
            <a href="#top">Back to top ↑</a>
          </li>
        </ul>
      </div>

      <footer className="footer mono">
        <span suppressHydrationWarning>© {new Date().getFullYear()} Shivastu Shrivastava</span>
        <span>Bangalore {time && `· ${time} IST`}</span>
        <span>Built by hand with Next.js</span>
      </footer>
    </section>
  );
}
