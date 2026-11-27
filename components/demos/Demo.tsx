import type { ReactNode } from "react";

// Frame shared by every case-study demo, with the same honest label on each.
export default function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="demo glass">
      <div className="demo__head">
        <span className="demo__pill mono">
          <span className="dot" aria-hidden /> Live demo
        </span>
        <span className="demo__title">{title}</span>
      </div>
      {children}
      <p className="demo__note mono">A simplified re-creation that runs in your browser, not production code.</p>
    </div>
  );
}
