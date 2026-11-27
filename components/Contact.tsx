"use client";

import { hero, links } from "../lib/content";
import { useClock } from "../lib/useClock";
import { SectionHead } from "./Motion";

export default function Contact() {
  const time = useClock();

  return (
    <section className="section contact" id="contact">
      <SectionHead title="Contact" n="04" />

      <a href={`mailto:${links.email}`} className="contact__big" data-reveal="fade">
        <span>Let&apos;s talk</span>
        <span className="contact__arrow" aria-hidden>
          ↗
        </span>
      </a>

      <dl className="contact__grid" data-reveal="fade">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${links.email}`} className="u">
              {links.email}
            </a>
          </dd>
        </div>
        <div>
          <dt>Elsewhere</dt>
          <dd>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="u">
              LinkedIn
            </a>
            ,{" "}
            <a href={links.github} target="_blank" rel="noreferrer" className="u">
              GitHub
            </a>
          </dd>
        </div>
        <div>
          <dt>Based</dt>
          <dd>
            Bangalore, IN <span className="tnum">{time && `· ${time} IST`}</span>
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className="dot" aria-hidden /> {hero.status}
          </dd>
        </div>
      </dl>

      <footer className="footer mono">
        <span suppressHydrationWarning>© {new Date().getFullYear()} Shivastu Shrivastava</span>
        <span>Built by hand with Next.js</span>
        <a href="#top" className="u">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
