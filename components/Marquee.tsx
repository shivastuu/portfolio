import { marquee } from "../lib/content";

// One slow ticker of the stack. Pure CSS; reduced motion stops it (see globals.css).
export default function Marquee() {
  const row = (hidden?: boolean) =>
    marquee.map((t) => (
      <span key={t} aria-hidden={hidden}>
        {t}
        <i aria-hidden />
      </span>
    ));

  return (
    <div className="ticker" aria-label="Tech stack">
      <div className="ticker__track">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
