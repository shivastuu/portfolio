"use client";

import type { MouseEvent } from "react";
import { switchTheme } from "../lib/theme";

// Light / dark switch. Light mode shows a moon ("turn the lights off"); dark mode shows a glowing bulb ("turn them on").
// The new theme spreads as a circle from the button (lib/theme.ts). CSS picks the icon from data-theme, so no React
// state is needed; the boot script re-applies the choice on load.
export default function ThemeToggle() {
  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    switchTheme(r.left + r.width / 2, r.top + r.height / 2);
  };

  return (
    <button type="button" className="toggle" onClick={flip} aria-label="Switch between light and dark mode" title="Light / dark">
      <svg className="toggle__moon" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.5 13.4A8.5 8.5 0 1 1 10.6 3.5a6.6 6.6 0 0 0 9.9 9.9z" />
        <g className="stars">
          <path d="M17 3.5v2M16 4.5h2" />
          <path d="M20.5 7.5v1.4M19.8 8.2h1.4" />
        </g>
      </svg>
      <svg className="toggle__bulb" viewBox="0 0 24 24" aria-hidden>
        <path className="glass" d="M12 3.2a5.8 5.8 0 0 0-3.4 10.5c.6.5 1 1.2 1 2v.6h4.8v-.6c0-.8.4-1.5 1-2A5.8 5.8 0 0 0 12 3.2z" />
        <path d="M9.6 18.4h4.8M10.4 20.8h3.2" />
        <path d="M10.6 13.3l1.4-1.8 1.4 1.8" stroke="#7a5b00" />
        <g className="rays">
          <path d="M12 .6v.9M3.2 9H2.3M21.7 9h-.9M5.3 2.9l.6.6M18.7 2.9l-.6.6" />
        </g>
      </svg>
    </button>
  );
}
