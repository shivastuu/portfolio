import Link from "next/link";
import { projects } from "../lib/content";
import { SectionHead } from "./Motion";

const pad = (n: number) => String(n).padStart(2, "0");

// A stepped stack of rows: each one is the whole link to its case study, and inverts on hover.
export default function Work() {
  return (
    <section className="section work" id="work">
      <SectionHead title="Selected work" n="02" />
      <p className="work__intro" data-reveal="fade">
        {projects.length} projects across fintech, design systems and AI security. Each row opens the full case study: the problem, what I built, the hard part and the result.
      </p>

      <ol className="rows">
        {projects.map((p, i) => (
          <li key={p.slug} className="row" data-reveal="fade">
            <Link href={`/work/${p.slug}`} className="row__link">
              <span className="row__no mono">{pad(i + 1)}</span>
              <div className="row__main">
                <h3 className="row__title">{p.title}</h3>
                <ul className="tags">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="row__side">
                <span className="row__kind mono">{p.kind}</span>
                <p className="row__big">{p.big}</p>
                <p className="row__cap">{p.caption}</p>
              </div>
              <span className="row__arrow" aria-hidden>
                ↗
              </span>
            </Link>
          </li>
        ))}
        <li className="row row--next" data-reveal="fade">
          <a href="#contact" className="row__link">
            <span className="row__no mono">{pad(projects.length + 1)}</span>
            <div className="row__main">
              <h3 className="row__title">Your team?</h3>
              <p className="row__cap">Looking for my next hard problem: payments, auth, performance or careful UI.</p>
            </div>
            <div className="row__side">
              <span className="row__kind mono">Up next</span>
              <p className="row__big">Let&apos;s talk</p>
            </div>
            <span className="row__arrow" aria-hidden>
              ↗
            </span>
          </a>
        </li>
      </ol>
    </section>
  );
}
