import Link from "next/link";

// home: same-page anchors. Elsewhere (case studies) links route back to the home sections;
// "Contact" stays on-page because every page ends with the contact section.
export default function Nav({ home = false }: { home?: boolean }) {
  const A = home ? "a" : Link;
  const to = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className="nav">
      <A href={home ? "#top" : "/"} className="nav__logo" aria-label={home ? "Back to top" : "Home"}>
        S/S<sup>®</sup>
      </A>
      <nav className="nav__links" aria-label="Sections">
        <A href={to("work")}>Work</A>
        <A href={to("about")}>About</A>
        <A href={to("experience")}>Experience</A>
        <a href="#contact">Contact</a>
      </nav>
      <a href="#contact" className="badge">
        Available for work <span className="dot" aria-hidden />
      </a>
    </header>
  );
}
