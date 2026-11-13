import Link from "next/link";
import Magnetic from "./Magnetic";
import ThemeToggle from "./ThemeToggle";
import { links } from "../lib/content";

// home: same-page anchors. Elsewhere (case studies) links route back to the home sections;
// "Let's talk" stays on-page because every page ends with the contact section.
export default function Nav({ home = false }: { home?: boolean }) {
  const A = home ? "a" : Link;
  const to = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className="nav" data-intro>
      <A href={home ? "#top" : "/"} className="nav__logo" aria-label={home ? "Back to top" : "Home"}>
        SS<sup>©</sup>
      </A>
      <nav className="nav__links">
        <A href={to("work")}>Work</A>
        <A href={to("about")}>About</A>
        <A href={to("experience")}>Experience</A>
        <a href={links.resume} target="_blank" rel="noreferrer">
          Résumé ↗
        </a>
      </nav>
      <div className="nav__end">
        <ThemeToggle />
        <Magnetic>
          <a href="#contact" className="pill">
            Let&apos;s talk
          </a>
        </Magnetic>
      </div>
    </header>
  );
}
