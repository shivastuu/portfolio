import { experience, skills } from "../lib/content";
import { SectionHead } from "./Motion";

export default function Experience() {
  return (
    <section className="section experience" id="experience">
      <SectionHead title="Experience" n="03" />

      <ol className="timeline">
        {experience.map((e) => (
          <li key={e.role} className="timeline__row" data-reveal="fade">
            <span className="mono timeline__when">{e.when}</span>
            <div>
              <h3>{e.role}</h3>
              <p className="timeline__org">{e.org}</p>
            </div>
            <p className="muted">{e.note}</p>
          </li>
        ))}
      </ol>

      <div className="skills">
        {skills.map((s) => (
          <div key={s.group} data-reveal="fade">
            <p className="mono skills__head">{s.group}</p>
            <p className="skills__list">{s.items.join(" / ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
