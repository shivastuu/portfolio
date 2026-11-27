import { about, stats } from "../lib/content";
import { SectionHead } from "./Motion";

// *wrapped* phrases stay full contrast; everything else is muted, so the sentence reads as its highlights.
const parts = about.split(/(\*[^*]+\*)/).filter(Boolean);

export default function About() {
  return (
    <section className="section about" id="about">
      <SectionHead title="About" n="01" />
      <p className="about__text" data-reveal="fade">
        {parts.map((seg, i) =>
          seg.startsWith("*") ? <strong key={i}>{seg.slice(1, -1)}</strong> : <span key={i}>{seg}</span>,
        )}
      </p>
      <ul className="stats">
        {stats.map((s) => (
          <li className="stat" key={s.label} data-reveal="fade">
            <span className="stat__num">
              {s.to}
              {s.suffix}
            </span>
            <span className="stat__label">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
