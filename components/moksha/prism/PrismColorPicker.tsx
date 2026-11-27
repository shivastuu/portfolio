'use client';
// Copied from github.com/shivastuu/moksha-ui (packages/ui/src/prism, commit 1c86995), MIT.
// It ships as @moksha-ui/core/prism in core 0.2.0, which isn't on npm yet; once it is, delete this folder and
// import { PrismColorPicker } from "@moksha-ui/core/prism" instead.
import { useEffect, useState } from 'react';
import { alpha, palette } from '@moksha-ui/tokens';
import { PrismScene } from './PrismScene';
import { MAX_ROTATION, PURPLE_END, redShare, spectralColor, spectrumPosition, wavelengthAt } from './optics';

export interface PrismColorPickerProps {
  /** The current color as `#RRGGBB`. Anything else shows plain white light. */
  value: string;
  /** Called with a `#RRGGBB` color when the user picks from the prism or the color wheel. */
  onChange: (color: string) => void;
}

const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

/** The whole color wheel: the spectrum, then the purple line back to red. */
const wheel = `linear-gradient(90deg, ${Array.from({ length: 13 }, (_, i) => spectralColor((i / 12) * PURPLE_END)).join(', ')})`;

const styles = `
  .moksha-prism-range { appearance: none; height: 10px; border-radius: 999px; cursor: pointer; margin: 0; width: 100%; }
  .moksha-prism-range::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${palette.slate[0]}; border: 2px solid ${alpha(palette.slate[950], 0.35)}; box-shadow: 0 1px 6px ${alpha(palette.slate[950], 0.4)}; }
  .moksha-prism-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${palette.slate[0]}; border: 2px solid ${alpha(palette.slate[950], 0.35)}; }
  .moksha-prism-range:focus-visible { outline: 2px solid var(--ds-color-focus-ring, ${palette.brand[600]}); outline-offset: 4px; }
  .moksha-prism-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`;

/** What the prism shows for a color, in words: a wavelength, a red + violet mix, or white light. */
export function describeColor(color: string) {
  const position = isHex(color) ? spectrumPosition(color) : null;
  if (position === null) return `${color}: white light, no single hue`;
  if (position > 1) {
    const red = Math.round(redShare(position) * 100);
    return `${color}: ${red}% red and ${100 - red}% violet light`;
  }
  return `${color}: ${Math.round(wavelengthAt(position))} nanometre light`;
}

/**
 * Pick a brand color from real light: a torch beam split by a 3D glass prism (Snell's law per
 * wavelength, Fresnel reflections), with a color-wheel and a tilt slider for keyboards. Web only;
 * needs `three` installed.
 */
export function PrismColorPicker({ value, onChange }: PrismColorPickerProps) {
  // Keep the exact spot picked on the prism; a color set from outside is placed by its hue.
  const [picked, setPicked] = useState<{ t: number; color: string } | null>(null);
  const [angle, setAngle] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const valid = isHex(value);
  const color = valid ? value.toUpperCase() : palette.slate[0];
  const position = picked?.color === color ? picked.t : valid ? spectrumPosition(color) : null;
  const pick = (t: number) => {
    const next = spectralColor(t);
    setPicked({ t, color: next });
    onChange(next);
  };

  // Tell screen readers once the color settles, not on every step of a drag.
  useEffect(() => {
    if (!valid) return;
    const id = setTimeout(() => setAnnouncement(describeColor(color)), 400);
    return () => clearTimeout(id);
  }, [color, valid]);

  const label = { fontSize: 12, color: `var(--ds-color-text-muted, ${palette.slate[600]})`, display: 'grid', gap: 8 } as const;
  const degrees = ((angle * 180) / Math.PI).toFixed(1);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <style href="moksha-ui-prism" precedence="default">
        {styles}
      </style>
      <PrismScene value={position} tint={color} angle={angle} onChange={pick} onAngleChange={setAngle} />
      <div style={{ display: 'flex', gap: 24, alignItems: 'end', flexWrap: 'wrap' }}>
        <label style={{ ...label, flex: '1 1 240px', maxWidth: 420 }}>
          Color wheel: spectrum, then pinks
          <input
            type="range"
            className="moksha-prism-range"
            min={0}
            max={Math.round(PURPLE_END * 1000)}
            value={Math.round((position ?? 0) * 1000)}
            aria-valuetext={describeColor(color)}
            onChange={(event) => pick(Number(event.target.value) / 1000)}
            style={{ background: wheel }}
          />
        </label>
        <label style={{ ...label, flex: '0 1 180px' }}>
          Tip the prism · {degrees}°
          <input
            type="range"
            className="moksha-prism-range"
            min={-100}
            max={100}
            value={Math.round((angle / MAX_ROTATION) * 100)}
            aria-valuetext={`${degrees} degrees`}
            onChange={(event) => setAngle((Number(event.target.value) / 100) * MAX_ROTATION)}
            style={{ background: `var(--ds-color-border, ${palette.slate[200]})` }}
          />
        </label>
      </div>
      <p aria-live="polite" className="moksha-prism-hidden">
        {announcement}
      </p>
    </div>
  );
}
