import Link from "next/link";
import Nav from "../components/Nav";
import Contact from "../components/Contact";

export const metadata = { title: "Page not found — Shivastu Shrivastava" };

export default function NotFound() {
  return (
    <main>
      <Nav />
      <section className="nf">
        <p className="mono">[404] Page not found</p>
        <h1 className="nf__big">
          Took a<br />
          wrong turn
        </h1>
        <p className="nf__text">This page doesn&apos;t exist, or it moved. The work is still where it was.</p>
        <div className="intro__cta">
          <Link href="/" className="btn btn--dark">
            Back home ↗
          </Link>
          <Link href="/#work" className="btn">
            See the work
          </Link>
        </div>
        <p className="nf__tip mono">Tip: press ⌘K (Ctrl+K) to jump anywhere.</p>
      </section>
      <Contact />
    </main>
  );
}
