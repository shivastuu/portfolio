"use client";

import { useEffect, useState } from "react";
import { links } from "../lib/content";
import { Lines } from "./Motion";
import Magnetic from "./Magnetic";

const clock = () =>
  new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());

export default function Contact() {
  // Client-only so server and client HTML match.
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(clock());
    const id = setInterval(() => setTime(clock()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="contact" id="contact">
      <p className="label" data-scramble>(Hiring? Let&apos;s talk)</p>
      <h2 className="contact__title" data-reveal="line">
        <Lines lines={["Let's build", <><em className="serif">something</em> that ships.</>]} />
      </h2>

      <div className="contact__cta" data-reveal="fade">
        <Magnetic>
          <a href={`mailto:${links.email}`} className="orb">
            Say hello <span aria-hidden>↗</span>
          </a>
        </Magnetic>
        <a href={`mailto:${links.email}`} className="contact__email">
          {links.email}
        </a>
      </div>

      <footer className="footer">
        <nav className="footer__links">
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={links.resume} target="_blank" rel="noreferrer">Résumé ↗</a>
        </nav>
        <p className="label">Bangalore {time && `· ${time} IST`}</p>
        <p className="label" suppressHydrationWarning>© {new Date().getFullYear()} Shivastu Shrivastava</p>
      </footer>
    </section>
  );
}
