// Copied from github.com/shivastuu/moksha-ui (packages/ui/src/prism, commit 1c86995), MIT.
// It ships as @moksha-ui/core/prism in core 0.2.0, which isn't on npm yet; once it is, delete this folder and
// import { PrismColorPicker } from "@moksha-ui/core/prism" instead.
import { hexToOklch, oklchToHex } from '@moksha-ui/tokens';

/** A point or direction in the prism's cross-section plane (x right, y up; the table top is y = TABLE_Y). */
export type Vec = [number, number];

export interface Ray {
  /** Where the white beam enters the glass. */
  entry: Vec;
  /** Entry, any internal bounce points, then the exit point. */
  inside: Vec[];
  exit: Vec;
  /** Unit direction of the light after it leaves the glass. */
  out: Vec;
}

/** Side of the equilateral cross-section, in scene units. */
export const SIDE = 2.4;
const HEIGHT = (SIDE * Math.sqrt(3)) / 2;
/** How far the prism can be tipped either way. */
export const MAX_ROTATION = (10 * Math.PI) / 180;
/** The prism stands on its base, so the base is the table top. */
export const TABLE_Y = -HEIGHT / 3;
/** The card that catches the spectrum stands upright here, facing the prism. */
export const CARD_X = 1.9;
export const CARD_HEIGHT = 1.45;

const BASE_CORNERS: [Vec, Vec, Vec] = [
  [0, (2 * HEIGHT) / 3],
  [-SIDE / 2, TABLE_Y],
  [SIDE / 2, TABLE_Y],
];
/** Edge 1 runs bottom-left → bottom-right: the base. */
export const BASE_EDGE = 1;

/**
 * Tipping the prism by `rotation` (positive = counterclockwise) pivots it on the bottom corner it
 * tips onto, the way a real prism rocks on a table, so it never sinks below the table top.
 */
export function prismPose(rotation = 0): { angle: number; offset: Vec } {
  const pivot = rotation >= 0 ? BASE_CORNERS[1] : BASE_CORNERS[2];
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return { angle: rotation, offset: [pivot[0] - (pivot[0] * cos - pivot[1] * sin), pivot[1] - (pivot[0] * sin + pivot[1] * cos)] };
}

/** Cross-section corners (apex, bottom-left, bottom-right; counterclockwise) for a tipped prism. */
export function prismVertices(rotation = 0): Vec[] {
  const { offset } = prismPose(rotation);
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return BASE_CORNERS.map(([x, y]) => [x * cos - y * sin + offset[0], x * sin + y * cos + offset[1]]);
}

/** t = 0 is the red end of the spectrum, t = 1 the violet end. */
export const wavelengthAt = (t: number) => 700 - 300 * t;

/**
 * Cauchy's equation, n = A + B / λ² (λ in µm). B is about 6× real crown glass so the fan is wide
 * enough to pick from; the geometry is otherwise exact.
 */
export const refractiveIndex = (nm: number) => 1.5 + 0.026 / (nm / 1000) ** 2;

/** The beam leaves a torch on the table and meets the left face 65% of the way up, at minimum deviation for mid-spectrum light. */
const incidence = Math.asin(refractiveIndex(550) * Math.sin(Math.PI / 6));
export const BEAM_ANGLE = incidence - Math.PI / 6;
export const BEAM_DIRECTION: Vec = [Math.cos(BEAM_ANGLE), Math.sin(BEAM_ANGLE)];
const aim: Vec = [
  BASE_CORNERS[1][0] + 0.65 * (BASE_CORNERS[0][0] - BASE_CORNERS[1][0]),
  BASE_CORNERS[1][1] + 0.65 * (BASE_CORNERS[0][1] - BASE_CORNERS[1][1]),
];
export const BEAM_SOURCE: Vec = [aim[0] - 2.4 * BEAM_DIRECTION[0], aim[1] - 2.4 * BEAM_DIRECTION[1]];

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
const cross = (a: Vec, b: Vec) => a[0] * b[1] - a[1] * b[0];

/** Snell's law in vector form. `normal` faces against `d`; `eta` is n(from) / n(to). Null means total internal reflection. */
function refract(d: Vec, normal: Vec, eta: number): Vec | null {
  const cosI = -dot(normal, d);
  const k = 1 - eta * eta * (1 - cosI * cosI);
  if (k < 0) return null;
  const f = eta * cosI - Math.sqrt(k);
  return [eta * d[0] + f * normal[0], eta * d[1] + f * normal[1]];
}

function reflect(d: Vec, normal: Vec): Vec {
  const k = 2 * dot(d, normal);
  return [d[0] - k * normal[0], d[1] - k * normal[1]];
}

/** Share of light reflected at a surface, unpolarised (Fresnel equations). 1 past the critical angle. */
export function reflectance(cosI: number, n1: number, n2: number) {
  const sinT = (n1 / n2) * Math.sqrt(Math.max(0, 1 - cosI * cosI));
  if (sinT >= 1) return 1;
  const cosT = Math.sqrt(1 - sinT * sinT);
  const rs = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
  const rp = (n1 * cosT - n2 * cosI) / (n1 * cosT + n2 * cosI);
  return (rs * rs + rp * rp) / 2;
}

/** Nearest edge the ray p + s·d crosses (s > 0), with that edge's outward normal. */
function hitEdge(p: Vec, d: Vec, corners: Vec[], skip = -1) {
  let best: { point: Vec; normal: Vec; edge: number; s: number } | null = null;
  for (let edge = 0; edge < 3; edge += 1) {
    if (edge === skip) continue;
    const a = corners[edge]!;
    const b = corners[(edge + 1) % 3]!;
    const e: Vec = [b[0] - a[0], b[1] - a[1]];
    const denominator = cross(d, e);
    if (Math.abs(denominator) < 1e-12) continue;
    const ap: Vec = [a[0] - p[0], a[1] - p[1]];
    const s = cross(ap, e) / denominator;
    const u = cross(ap, d) / denominator;
    if (s > 1e-9 && u >= 0 && u <= 1 && (!best || s < best.s)) {
      const length = Math.hypot(e[0], e[1]);
      best = { point: [p[0] + s * d[0], p[1] + s * d[1]], normal: [e[1] / length, -e[0] / length], edge, s };
    }
  }
  return best;
}

/** Follows one wavelength of the white beam through the prism. Null if it never leaves the glass. */
export function trace(t: number, rotation = 0): Ray | null {
  const corners = prismVertices(rotation);
  const n = refractiveIndex(wavelengthAt(t));
  const first = hitEdge(BEAM_SOURCE, BEAM_DIRECTION, corners);
  if (!first) return null;
  let d = refract(BEAM_DIRECTION, first.normal, 1 / n);
  if (!d) return null;
  const inside: Vec[] = [first.point];
  let point = first.point;
  let edge = first.edge;
  for (let bounce = 0; bounce < 3; bounce += 1) {
    const next = hitEdge(point, d, corners, edge);
    if (!next) return null;
    inside.push(next.point);
    const inward: Vec = [-next.normal[0], -next.normal[1]];
    const out = refract(d, inward, n);
    if (out) return { entry: first.point, inside, exit: next.point, out };
    d = reflect(d, inward);
    point = next.point;
    edge = next.edge;
  }
  return null;
}

export interface Ghosts {
  /** The white beam's partial reflection off the entry face. */
  glint: { from: Vec; direction: Vec; strength: number };
  /** Light reflected back inside at the exit face that reaches the base and leaves into the table. */
  base: { point: Vec; strength: number } | null;
}

/** The faint reflections real glass makes, with strengths from the Fresnel equations. */
export function ghosts(t: number, rotation = 0): Ghosts | null {
  const corners = prismVertices(rotation);
  const n = refractiveIndex(wavelengthAt(t));
  const first = hitEdge(BEAM_SOURCE, BEAM_DIRECTION, corners);
  if (!first) return null;
  const glint = {
    from: first.point,
    direction: reflect(BEAM_DIRECTION, first.normal),
    strength: reflectance(-dot(first.normal, BEAM_DIRECTION), 1, n),
  };
  const d = refract(BEAM_DIRECTION, first.normal, 1 / n);
  const exit = d && hitEdge(first.point, d, corners, first.edge);
  if (!d || !exit) return { glint, base: null };
  const inward: Vec = [-exit.normal[0], -exit.normal[1]];
  const bounced = hitEdge(exit.point, reflect(d, inward), corners, exit.edge);
  const strength = (1 - glint.strength) * reflectance(-dot(inward, d), n, 1);
  return { glint, base: bounced?.edge === BASE_EDGE ? { point: bounced.point, strength } : null };
}

/** Height where a ray meets the card, or null if it misses it. */
export function cardHit(ray: Ray): number | null {
  if (ray.out[0] <= 0) return null;
  const y = ray.exit[1] + ((CARD_X - ray.exit[0]) / ray.out[0]) * ray.out[1];
  return y >= TABLE_Y && y <= TABLE_Y + CARD_HEIGHT ? y : null;
}

/** The spectrum position whose outgoing ray passes closest to `q`, ahead of where it leaves the glass. */
export function nearestRay(q: Vec, rays: (Ray | null)[]) {
  let best = { t: 0, distance: Infinity };
  rays.forEach((ray, i) => {
    if (!ray) return;
    const v: Vec = [q[0] - ray.exit[0], q[1] - ray.exit[1]];
    if (dot(v, ray.out) < 0) return;
    const distance = Math.abs(cross(v, ray.out));
    if (distance < best.distance) best = { t: i / (rays.length - 1), distance };
  });
  return best;
}

export function insideTriangle(q: Vec, corners: Vec[]) {
  return corners.every((a, i) => {
    const b = corners[(i + 1) % 3]!;
    return cross([b[0] - a[0], b[1] - a[1]], [q[0] - a[0], q[1] - a[1]]) >= 0;
  });
}

/** Approximate OKLCH hue of pure spectral light, by wavelength in nm (red to violet). */
const SPECTRAL_HUES: [number, number][] = [
  [700, 29], [650, 33], [610, 45], [590, 62], [575, 95], [560, 118], [540, 135], [520, 145],
  [500, 175], [490, 200], [475, 235], [460, 258], [440, 272], [420, 288], [400, 300],
];
const RED_HUE = SPECTRAL_HUES[0]![1];
const VIOLET_HUE = SPECTRAL_HUES[SPECTRAL_HUES.length - 1]![1];

/**
 * Positions past 1 are the purple line: pinks and magentas, which no single wavelength makes. They
 * are red and violet light mixed; 1 is pure violet and PURPLE_END pure red, where the wheel closes.
 */
export const PURPLE_END = 1.25;

/** For a purple-line position, the share of red light in the red + violet mix. */
export const redShare = (t: number) => Math.min(1, Math.max(0, (t - 1) / (PURPLE_END - 1)));

export function hueAt(nm: number) {
  for (let i = 1; i < SPECTRAL_HUES.length; i += 1) {
    const [l1, h1] = SPECTRAL_HUES[i - 1]!;
    const [l2, h2] = SPECTRAL_HUES[i]!;
    if (nm >= l2) return h1 + ((l1 - nm) / (l1 - l2)) * (h2 - h1);
  }
  return VIOLET_HUE;
}

/** OKLCH hue for any position on the wheel: the spectrum, then the purple line back to red. */
export function hueAtPosition(t: number) {
  if (t <= 1) return hueAt(wavelengthAt(t));
  return (VIOLET_HUE + redShare(t) * (RED_HUE + 360 - VIOLET_HUE)) % 360;
}

/** Where a colour sits (0–1 spectrum, 1–PURPLE_END purple line), or null for greys: white light, every wavelength at once. */
export function spectrumPosition(hex: string): number | null {
  const { c, h: angle } = hexToOklch(hex);
  if (c < 0.04) return null;
  const h = (angle + 360) % 360; // hexToOklch gives -180..180
  if (h >= RED_HUE && h <= VIOLET_HUE) {
    for (let i = 1; i < SPECTRAL_HUES.length; i += 1) {
      const [l1, h1] = SPECTRAL_HUES[i - 1]!;
      const [l2, h2] = SPECTRAL_HUES[i]!;
      if (h >= h1 && h <= h2) return (700 - (l1 + ((h - h1) / (h2 - h1)) * (l2 - l1))) / 300;
    }
  }
  const unwrapped = h < RED_HUE ? h + 360 : h;
  return 1 + ((unwrapped - VIOLET_HUE) / (RED_HUE + 360 - VIOLET_HUE)) * (PURPLE_END - 1);
}

const colorCache = new Map<number, string>();

/**
 * A usable brand colour for a wheel position: the hue's most vivid sRGB lightness, pulled toward
 * the middle so yellows and greens aren't too pale for a brand.
 */
export function spectralColor(t: number): string {
  const key = Math.round(t * 1000);
  const cached = colorCache.get(key);
  if (cached) return cached;
  const h = hueAtPosition(key / 1000);
  let vivid = { l: 0.6, c: 0 };
  for (let l = 0.3; l <= 0.98; l += 0.02) {
    const { c } = hexToOklch(oklchToHex({ l, c: 0.4, h }));
    if (c > vivid.c) vivid = { l, c };
  }
  const l = vivid.l * 0.6 + 0.62 * 0.4;
  const color = oklchToHex({ l, c: 0.4, h }).toUpperCase();
  colorCache.set(key, color);
  return color;
}
