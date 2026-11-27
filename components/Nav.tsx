import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import CmdButton from "./CmdButton";
import MobileMenu from "./MobileMenu";

// home: same-page anchors. Elsewhere (case studies) links route back to the home sections;
// "Contact" stays on-page because every page ends with the contact section.
// Link labels roll up on hover (the second copy is a text-shadow, see .nav__links in globals.css).
export default function Nav({ home = false }: { home?: boolean }) {
  const A = home ? "a" : Link;
  const to = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className="nav">
      <A href={home ? "#top" : "/"} className="nav__logo">
        S/S<sup>®</sup>
        <span className="sr-only">{home ? " — back to top" : " — home"}</span>
      </A>
      <nav className="nav__links" aria-label="Sections">
        <A href={to("work")}>
          <span>Work</span>
        </A>
        <A href={to("about")}>
          <span>About</span>
        </A>
        <A href={to("open-source")}>
          <span>Open source</span>
        </A>
        <A href={to("experience")}>
          <span>Experience</span>
        </A>
        <a href="#contact">
          <span>Contact</span>
        </a>
      </nav>
      <div className="nav__end">
        <CmdButton />
        <a href="#contact" className="badge">
          Available for work <span className="dot" aria-hidden />
        </a>
        <ThemeToggle />
        <MobileMenu home={home} />
      </div>
      <i className="nav__progress" aria-hidden />
    </header>
  );
}
