'use client';
// Copied from github.com/shivastuu/moksha-ui (packages/ui/src/prism, commit 1c86995), MIT.
// It ships as @moksha-ui/core/prism in core 0.2.0, which isn't on npm yet; once it is, delete this folder and
// import { PrismColorPicker } from "@moksha-ui/core/prism" instead.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { alpha, palette } from '@moksha-ui/tokens';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import {
  BEAM_ANGLE,
  BEAM_DIRECTION,
  BEAM_SOURCE,
  CARD_HEIGHT,
  CARD_X,
  MAX_ROTATION,
  PURPLE_END,
  SIDE,
  TABLE_Y,
  cardHit,
  ghosts,
  insideTriangle,
  nearestRay,
  prismPose,
  prismVertices,
  redShare,
  refractiveIndex,
  spectralColor,
  trace,
  wavelengthAt,
  type Ray,
  type Vec,
} from './optics';

const SAMPLES = 97;
const DEPTH = 1.8;
const BEVEL = 0.07;
const TURN = 0.3;
/** The card is turned toward the viewer about a vertical line through x = CARD_X, so the rays still land at the same heights. */
const CARD_YAW = 0.6;
const cardAcross = new THREE.Vector3(Math.sin(CARD_YAW), 0, Math.cos(CARD_YAW));
const cardFacing = new THREE.Vector3(-Math.cos(CARD_YAW), 0, Math.sin(CARD_YAW));
const onCardFace = (y: number, lift: number) => new THREE.Vector3(CARD_X, y, 0).addScaledVector(cardFacing, lift);
const STAGE = palette.slate[950];
const white = palette.slate[0];

const lightVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vColor;
  void main() {
    vUv = uv;
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lightFragment = /* glsl */ `
  uniform float uIntensity;
  uniform vec2 uFade;      // x: fade-in length from the start, y: where the fade-out starts (0-1 along)
  uniform float uTail;     // brightness left at the far end
  uniform float uBeam;     // 1: soft across the width (a beam), 0: soft only at the outer edges (a fan)
  varying vec2 vUv;
  varying vec3 vColor;
  void main() {
    float along = smoothstep(0.0, max(uFade.x, 0.0001), vUv.x) * (1.0 - smoothstep(uFade.y, 1.0, vUv.x));
    along *= mix(1.0, uTail, vUv.x);
    float edges = smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y));
    float across = mix(edges, exp(-pow((vUv.y - 0.5) * 4.2, 2.0)), uBeam);
    gl_FragColor = vec4(vColor * uIntensity * along * across, 1.0);
  }
`;

/** A polished dark table: a dimmed, slightly blurred mirror with a faint grid that fades away from the prism. */
const tableShader = {
  name: 'PrismTable',
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    uBase: { value: new THREE.Color(palette.slate[950]) },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    varying vec2 vPos;
    #include <common>
    #include <logdepthbuf_pars_vertex>
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      vPos = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      #include <logdepthbuf_vertex>
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform vec3 uBase;
    varying vec4 vUv;
    varying vec2 vPos;
    #include <logdepthbuf_pars_fragment>
    void main() {
      #include <logdepthbuf_fragment>
      vec2 uv = vUv.xy / vUv.w;
      vec2 o = vec2(0.0018, 0.0);
      vec3 reflection = texture2D(tDiffuse, uv).rgb * 0.4
        + (texture2D(tDiffuse, uv + o.xy).rgb + texture2D(tDiffuse, uv - o.xy).rgb
         + texture2D(tDiffuse, uv + o.yx).rgb + texture2D(tDiffuse, uv - o.yx).rgb) * 0.15;
      vec2 cell = vPos / 0.35;
      vec2 g = abs(fract(cell - 0.5) - 0.5) / fwidth(cell);
      float line = 1.0 - min(min(g.x, g.y), 1.0);
      float near = exp(-dot(vPos, vPos) * 0.06);
      gl_FragColor = vec4(uBase + reflection * color * exp(-length(vPos) * 0.06) + line * 0.012 * near, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};

function lightMaterial(intensity: number, fade: Vec, beam: boolean, tail = 1) {
  return new THREE.ShaderMaterial({
    vertexShader: lightVertex,
    fragmentShader: lightFragment,
    vertexColors: true,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uIntensity: { value: intensity },
      uFade: { value: new THREE.Vector2(...fade) },
      uTail: { value: tail },
      uBeam: { value: beam ? 1 : 0 },
    },
  });
}

function geometry(positions: number[], uvs: number[], colors: number[], index: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(index);
  return g;
}

/** A band of light along a polyline: uv.x runs along it, uv.y across `side` (a half-width vector). */
function strip(points: THREE.Vector3[], side: THREE.Vector3, colors: THREE.Color[]) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const vertexColors: number[] = [];
  const index: number[] = [];
  points.forEach((p, i) => {
    positions.push(p.x - side.x, p.y - side.y, p.z - side.z, p.x + side.x, p.y + side.y, p.z + side.z);
    const u = points.length > 1 ? i / (points.length - 1) : 0;
    uvs.push(u, 0, u, 1);
    const { r, g, b } = colors[i]!;
    vertexColors.push(r, g, b, r, g, b);
    if (i > 0) index.push(2 * i - 2, 2 * i, 2 * i - 1, 2 * i - 1, 2 * i, 2 * i + 1);
  });
  return geometry(positions, uvs, vertexColors, index);
}

/** A straight beam from a to b in the prism's plane. */
function ribbon(a: Vec, b: Vec, width: number, color: THREE.Color) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const side = new THREE.Vector3((-(b[1] - a[1]) / length) * (width / 2), ((b[0] - a[0]) / length) * (width / 2), 0);
  return strip([new THREE.Vector3(a[0], a[1], 0), new THREE.Vector3(b[0], b[1], 0)], side, [color, color]);
}

/** Where a ray lands on the card. */
const landing = (ray: Ray): Vec => [CARD_X, cardHit(ray) ?? TABLE_Y];

/** The spread of colours, either inside the glass (entry to exit) or after it (exit to the card). */
function fan(rays: Ray[], colors: THREE.Color[], part: 'inside' | 'outside') {
  const positions: number[] = [];
  const uvs: number[] = [];
  const vertexColors: number[] = [];
  const index: number[] = [];
  rays.forEach((ray, i) => {
    const t = i / (rays.length - 1);
    const start = part === 'inside' ? ray.entry : ray.exit;
    const end = part === 'inside' ? ray.exit : landing(ray);
    positions.push(start[0], start[1], 0, end[0], end[1], 0);
    uvs.push(0, t, 1, t);
    const { r, g, b } = colors[i]!;
    vertexColors.push(r, g, b, r, g, b);
    if (i > 0) index.push(2 * i - 2, 2 * i, 2 * i - 1, 2 * i - 1, 2 * i, 2 * i + 1);
  });
  return geometry(positions, uvs, vertexColors, index);
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d')!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const wrap = (t: number) => ((t % PURPLE_END) + PURPLE_END) % PURPLE_END;
const smooth = (edge0: number, edge1: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return k * k * (3 - 2 * k);
};

export interface PrismProps {
  /** Where the brand colour sits: 0–1 the spectrum (red to violet), 1–1.25 the purple line, null white light. */
  value: number | null;
  /** The brand colour itself, for the readout and the glass tint. */
  tint: string;
  /** How far the prism is tipped, in radians (±MAX_ROTATION). */
  angle: number;
  onChange: (t: number) => void;
  onAngleChange: (angle: number) => void;
}

/**
 * A glass prism on a polished table, splitting a torch's white beam into a spectrum that lands on a
 * card. Rays follow Snell's law per wavelength and the faint ghosts follow the Fresnel equations
 * (prismOptics.ts). Drag across the light or the card to pick; drag the glass to tip it.
 */
export function PrismScene({ value, tint, angle, onChange, onAngleChange }: PrismProps) {
  const container = useRef<HTMLDivElement>(null);
  const live = useRef({ value, tint, angle, onChange, onAngleChange, rebuild: () => {}, retarget: () => {} });
  const [failed, setFailed] = useState(false);
  Object.assign(live.current, { value, tint, angle, onChange, onAngleChange });

  useEffect(() => live.current.rebuild(), [angle]);
  useEffect(() => live.current.retarget(), [value, tint]);

  useEffect(() => {
    const host = container.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%', touchAction: 'none' });
    host.prepend(canvas);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const backgroundTexture = canvasTexture(512, 256, (ctx) => {
      const glow = ctx.createRadialGradient(256, 40, 10, 256, 128, 330);
      glow.addColorStop(0, palette.slate[900]);
      glow.addColorStop(1, STAGE);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 512, 256);
    });
    scene.background = backgroundTexture;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.4;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.38, 0.3, 0.8));
    composer.addPass(new OutputPass());

    const rig = new THREE.Group();
    rig.rotation.y = TURN;
    scene.add(rig);

    const table = new Reflector(new THREE.PlaneGeometry(30, 20), {
      clipBias: 0.003,
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0x8a8f99,
      shader: tableShader,
    });
    table.rotation.x = -Math.PI / 2;
    table.position.y = TABLE_Y;
    rig.add(table);

    // The glass, inset by the bevel so its outer faces sit exactly on the optics triangle.
    const inradius = SIDE / (2 * Math.sqrt(3));
    const inset = prismVertices(0).map(([x, y]) => new THREE.Vector2(x, y).multiplyScalar((inradius - BEVEL) / inradius));
    const prismGeometry = new THREE.ExtrudeGeometry(new THREE.Shape(inset), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 6,
    });
    prismGeometry.translate(0, 0, -DEPTH / 2);
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 1.2,
      ior: 1.5,
      dispersion: 3,
      specularIntensity: 0.7,
      attenuationColor: new THREE.Color(tint),
      attenuationDistance: 14,
      envMapIntensity: 0.8,
    });
    const prism = new THREE.Mesh(prismGeometry, glass);
    rig.add(prism);

    // Hairline highlights on the glass edges.
    const corners = prismVertices(0);
    const edgePoints: number[] = [];
    corners.forEach(([x, y], i) => {
      const [nx, ny] = corners[(i + 1) % 3]!;
      for (const z of [-DEPTH / 2 - BEVEL, DEPTH / 2 + BEVEL]) edgePoints.push(x, y, z, nx, ny, z);
      edgePoints.push(x, y, -DEPTH / 2 - BEVEL, x, y, DEPTH / 2 + BEVEL);
    });
    const edgesGeometry = new THREE.BufferGeometry();
    edgesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePoints, 3));
    const edges = new THREE.LineSegments(
      edgesGeometry,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false })
    );
    rig.add(edges);

    // The torch on the table, tilted up along the beam, and the card that catches the spectrum.
    const beam = new THREE.Vector3(BEAM_DIRECTION[0], BEAM_DIRECTION[1], 0);
    const torchMetal = new THREE.MeshPhysicalMaterial({ color: palette.slate[900], metalness: 0.85, roughness: 0.3, clearcoat: 0.5 });
    const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.75, 40), torchMetal);
    torch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beam);
    torch.position.set(BEAM_SOURCE[0], BEAM_SOURCE[1], 0).addScaledVector(beam, -0.385);
    rig.add(torch);
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.014, 12, 48),
      new THREE.MeshPhysicalMaterial({ color: palette.slate[500], metalness: 1, roughness: 0.25 })
    );
    bezel.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), beam);
    bezel.position.set(BEAM_SOURCE[0], BEAM_SOURCE[1], 0);
    rig.add(bezel);
    // A small stand under the torch, so it rests on the table at the beam's angle.
    const standTop = torch.position.y - 0.095;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, standTop - TABLE_Y, 24), torchMetal);
    stand.position.set(torch.position.x, (standTop + TABLE_Y) / 2, 0);
    rig.add(stand);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.025, 40), torchMetal);
    foot.position.set(torch.position.x, TABLE_Y + 0.0125, 0);
    rig.add(foot);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 3) }));
    lens.position.set(BEAM_SOURCE[0] + BEAM_DIRECTION[0] * 0.012, BEAM_SOURCE[1] + BEAM_DIRECTION[1] * 0.012, 0);
    lens.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(BEAM_DIRECTION[0], BEAM_DIRECTION[1], 0));
    rig.add(lens);
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, CARD_HEIGHT, 1.7),
      new THREE.MeshStandardMaterial({ color: palette.slate[800], roughness: 0.85, metalness: 0 })
    );
    card.position.copy(onCardFace(TABLE_Y + CARD_HEIGHT / 2, -0.0175));
    card.rotation.y = CARD_YAW;
    rig.add(card);

    const light = (intensity: number, fade: Vec, beam: boolean, tail = 1) => {
      const mesh = new THREE.Mesh(new THREE.BufferGeometry(), lightMaterial(intensity, fade, beam, tail));
      mesh.renderOrder = 1;
      rig.add(mesh);
      return mesh;
    };
    const incoming = light(1.4, [0.0001, 0.999], true);
    const glint = light(1, [0.0001, 0.2], true);
    const fanInside = light(0.18, [0.0001, 0.999], false);
    const fanOutside = light(0.45, [0.0001, 0.999], false, 0.75);
    const band = light(1.5, [0.0001, 0.999], true);
    const baseGlow = light(1, [0.0001, 0.999], true);
    const picks = [0, 1].map(() => ({
      inside: light(0.6, [0.0001, 0.999], true),
      outside: light(1.4, [0.0001, 0.999], true, 0.8),
      spot: light(2, [0.35, 0.65], true),
    }));

    const glowTexture = canvasTexture(128, 128, (ctx) => {
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, alpha(white, 1));
      g.addColorStop(0.2, alpha(white, 0.25));
      g.addColorStop(1, alpha(white, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    });
    const glow = (size: number) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexture, opacity: 0.6, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false })
      );
      sprite.scale.setScalar(size);
      sprite.renderOrder = 2;
      rig.add(sprite);
      return sprite;
    };
    const lensGlow = glow(0.26);
    lensGlow.position.copy(lens.position);
    const entryGlow = glow(0.3);
    const exitGlows = [glow(0.36), glow(0.36)];

    const colors = Array.from({ length: SAMPLES }, (_, i) => new THREE.Color(spectralColor(i / (SAMPLES - 1))));
    const ends = (i: number) => smooth(0, 0.07, i / (SAMPLES - 1)) * smooth(0, 0.07, 1 - i / (SAMPLES - 1));
    let rays: Ray[] = [];
    let landings: number[] = [];
    let dirty = true;
    const replace = (mesh: THREE.Mesh, next: THREE.BufferGeometry) => {
      mesh.geometry.dispose();
      mesh.geometry = next;
    };
    const setIntensity = (mesh: THREE.Mesh, intensity: number) => {
      (mesh.material as THREE.ShaderMaterial).uniforms['uIntensity']!.value = intensity;
    };

    // What's drawn eases toward the target, so a preset or a typed colour glides along the spectrum.
    const start = live.current.value;
    const shown = { t: start ?? 0.5, pick: start === null ? 0 : 1, white: start === null ? 1 : 0 };

    const drawPicks = () => {
      const t = wrap(shown.t);
      const share = t > 1 ? redShare(t) : 0;
      const lines =
        t > 1
          ? [
              { t: 0, weight: share },
              { t: 1, weight: 1 - share },
            ]
          : [
              { t, weight: 1 },
              { t: 0, weight: 0 },
            ];
      lines.forEach((line, i) => {
        const { inside, outside, spot } = picks[i]!;
        const exitGlow = exitGlows[i]!;
        const ray = trace(line.t, live.current.angle);
        const weight = line.weight * shown.pick;
        const visible = ray !== null && weight > 0.002;
        for (const object of [inside, outside, spot, exitGlow]) object.visible = visible;
        if (!ray || !visible) return;
        const color = new THREE.Color(spectralColor(line.t)).multiplyScalar(weight);
        const end = landing(ray);
        replace(inside, ribbon(ray.entry, ray.exit, 0.035, color));
        replace(outside, ribbon(ray.exit, end, 0.06, color));
        replace(
          spot,
          strip(
            [onCardFace(end[1], 0.006).addScaledVector(cardAcross, -0.42), onCardFace(end[1], 0.006).addScaledVector(cardAcross, 0.42)],
            new THREE.Vector3(0, 0.035, 0),
            [color, color]
          )
        );
        exitGlow.position.set(ray.exit[0], ray.exit[1], 0);
        exitGlow.material.color = color;
      });
      setIntensity(incoming, 1.4 + 0.9 * shown.white);
      setIntensity(fanOutside, 0.45 + 0.3 * shown.white);
      setIntensity(band, 1.5 + 0.6 * shown.white);
      glass.attenuationColor.set(live.current.tint);
      dirty = true;
    };

    const rebuild = () => {
      const rotation = live.current.angle;
      const traced = Array.from({ length: SAMPLES }, (_, i) => trace(i / (SAMPLES - 1), rotation));
      if (traced.some((ray) => !ray)) return; // can't happen within MAX_ROTATION (prismOptics.test.ts)
      rays = traced as Ray[];
      landings = rays.map((ray) => landing(ray)[1]);
      const { angle: a, offset } = prismPose(rotation);
      for (const object of [prism, edges]) {
        object.rotation.z = a;
        object.position.set(offset[0], offset[1], 0);
      }
      replace(fanInside, fan(rays, colors, 'inside'));
      replace(fanOutside, fan(rays, colors, 'outside'));
      const { entry } = rays[0]!;
      replace(incoming, ribbon(BEAM_SOURCE, entry, 0.06, new THREE.Color(1, 1, 1)));
      entryGlow.position.set(entry[0], entry[1], 0);
      replace(
        band,
        strip(
          landings.map((y) => onCardFace(y, 0.004)),
          cardAcross.clone().multiplyScalar(0.4),
          colors.map((c, i) => c.clone().multiplyScalar(ends(i)))
        )
      );

      // Fresnel ghosts: the glint off the entry face, and the internal reflection leaving through the base.
      const g = ghosts(0.5, rotation)!;
      const glintEnd: Vec = [g.glint.from[0] + g.glint.direction[0] * 0.6, g.glint.from[1] + g.glint.direction[1] * 0.6];
      replace(glint, ribbon(g.glint.from, glintEnd, 0.05, new THREE.Color(1, 1, 1).multiplyScalar(g.glint.strength * 3)));
      const under = rays.map((_, i) => ({ base: ghosts(i / (SAMPLES - 1), rotation)?.base, i })).filter((s) => s.base);
      replace(
        baseGlow,
        strip(
          under.map((s) => new THREE.Vector3(s.base!.point[0], TABLE_Y + 0.004, 0)),
          new THREE.Vector3(0, 0, 0.45),
          under.map((s) => colors[s.i]!.clone().multiplyScalar(s.base!.strength * 12 * ends(s.i)))
        )
      );
      drawPicks();
    };

    const retarget = () => {
      const target = live.current.value;
      if (target !== null) {
        // Glide the short way round the colour wheel.
        let delta = target - wrap(shown.t);
        if (Math.abs(delta) > PURPLE_END / 2) delta -= Math.sign(delta) * PURPLE_END;
        shown.t = target - delta;
      }
      if (reducedMotion) {
        if (target !== null) shown.t = target;
        shown.pick = target === null ? 0 : 1;
        shown.white = target === null ? 1 : 0;
      }
      drawPicks();
    };

    live.current.rebuild = rebuild;
    live.current.retarget = retarget;
    rebuild();

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane();
    /** Where the pointer meets a plane given in the prism's own (rig) coordinates. */
    const pointerOn = (event: PointerEvent, normal: THREE.Vector3, point: THREE.Vector3) => {
      const box = canvas.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1),
        camera
      );
      rig.updateMatrixWorld();
      plane.setFromNormalAndCoplanarPoint(normal.transformDirection(rig.matrixWorld), point.applyMatrix4(rig.matrixWorld));
      const hit = raycaster.ray.intersectPlane(plane, new THREE.Vector3());
      return hit ? rig.worldToLocal(hit) : null;
    };
    const onLightPlane = (event: PointerEvent): Vec | null => {
      const p = pointerOn(event, new THREE.Vector3(0, 0, 1), new THREE.Vector3());
      return p ? [p.x, p.y] : null;
    };
    /** Spectrum position under the pointer on the card's face, or null if it's off the band. */
    const onCard = (event: PointerEvent, clamp = false) => {
      const p = pointerOn(event, cardFacing.clone(), new THREE.Vector3(CARD_X, 0, 0));
      if (!p) return null;
      const onFace = Math.abs((p.x - CARD_X) * cardAcross.x + p.z * cardAcross.z) <= 0.85 && p.y >= TABLE_Y && p.y <= TABLE_Y + CARD_HEIGHT;
      if (!clamp && (!onFace || p.y > Math.max(...landings) + 0.12 || p.y < Math.min(...landings) - 0.12)) return null;
      let best = 0;
      landings.forEach((y, i) => {
        if (Math.abs(y - p.y) < Math.abs(landings[best]! - p.y)) best = i;
      });
      return best / (SAMPLES - 1);
    };

    const parallax = { x: 0, target: 0 };
    let drag: { mode: 'tip'; x: number; start: number } | { mode: 'light' } | { mode: 'card' } | null = null;

    const onPointerDown = (event: PointerEvent) => {
      const q = onLightPlane(event);
      if (q && insideTriangle(q, prismVertices(live.current.angle))) {
        drag = { mode: 'tip', x: event.clientX, start: live.current.angle };
        canvas.style.cursor = 'grabbing';
      } else {
        const fromCard = onCard(event);
        const nearest = q ? nearestRay(q, rays) : null;
        if (fromCard !== null) {
          drag = { mode: 'card' };
          live.current.onChange(fromCard);
        } else if (nearest && nearest.distance <= 0.35) {
          drag = { mode: 'light' };
          live.current.onChange(nearest.t);
        } else return;
      }
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!reducedMotion) {
        const box = canvas.getBoundingClientRect();
        parallax.target = (((event.clientX - box.left) / box.width) * 2 - 1) * 0.07;
      }
      if (drag?.mode === 'tip') {
        const next = drag.start - (event.clientX - drag.x) * 0.004;
        live.current.onAngleChange(THREE.MathUtils.clamp(next, -MAX_ROTATION, MAX_ROTATION));
        return;
      }
      if (drag?.mode === 'card') {
        const t = onCard(event, true);
        if (t !== null) live.current.onChange(t);
        return;
      }
      const q = onLightPlane(event);
      if (drag?.mode === 'light') {
        if (q) live.current.onChange(nearestRay(q, rays).t);
        return;
      }
      if (q && insideTriangle(q, prismVertices(live.current.angle))) canvas.style.cursor = 'grab';
      else if (onCard(event) !== null || (q && nearestRay(q, rays).distance <= 0.35)) canvas.style.cursor = 'crosshair';
      else canvas.style.cursor = 'default';
    };
    const onPointerUp = () => {
      drag = null;
      canvas.style.cursor = 'default';
    };
    const onPointerLeave = () => {
      parallax.target = 0;
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = renderer.getPixelRatio();
      renderer.setSize(width, height, false);
      composer.setPixelRatio(ratio);
      composer.setSize(width, height);
      table.getRenderTarget().setSize(Math.round(width * ratio * 0.6), Math.round(height * ratio * 0.6));
      camera.aspect = width / height;
      // Wide stages frame torch, prism and card; narrow ones frame the prism and the card.
      const narrow = camera.aspect < 1.3;
      const target = new THREE.Vector3(narrow ? 0.45 : -0.4, 0.2, 0);
      const halfWidth = narrow ? 2.2 : 3.9;
      const distance = Math.max(5.2, halfWidth / (camera.aspect * Math.tan(THREE.MathUtils.degToRad(15))));
      camera.position.set(target.x, target.y + distance * 0.27, distance);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let onScreen = true;
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
    });
    visibility.observe(host);

    const started = performance.now();
    let last = started;
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!onScreen) return;
      if (!reducedMotion) {
        const target = live.current.value;
        const ease = 1 - Math.exp(-dt * 10);
        const goal = { t: target ?? shown.t, pick: target === null ? 0 : 1, white: target === null ? 1 : 0 };
        const moving =
          Math.abs(goal.t - shown.t) > 1e-4 || Math.abs(goal.pick - shown.pick) > 1e-3 || Math.abs(goal.white - shown.white) > 1e-3;
        if (moving) {
          shown.t += (goal.t - shown.t) * ease;
          shown.pick += (goal.pick - shown.pick) * ease;
          shown.white += (goal.white - shown.white) * ease;
          drawPicks();
        }
        parallax.x += (parallax.target - parallax.x) * 0.06;
        rig.rotation.y = TURN + Math.sin(((now - started) / 1000) * 0.3) * 0.035 + parallax.x;
        dirty = true;
      }
      if (!dirty) return;
      composer.render();
      dirty = false;
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      live.current.rebuild = () => {};
      live.current.retarget = () => {};
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Sprite) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      table.dispose();
      for (const texture of [backgroundTexture, glowTexture, environment]) texture.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  const label: CSSProperties = {
    position: 'absolute',
    font: '500 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace',
    color: alpha(white, 0.72),
    pointerEvents: 'none',
  };
  let readout: string;
  if (value === null) readout = 'white light: every wavelength at once';
  else if (value > 1) {
    const red = Math.round(redShare(value) * 100);
    readout = `${red}% red + ${100 - red}% violet light · no single wavelength makes it`;
  } else {
    const nm = Math.round(wavelengthAt(value));
    const ray = trace(value, angle);
    const bent = ray ? (Math.acos(ray.out[0] * BEAM_DIRECTION[0] + ray.out[1] * BEAM_DIRECTION[1]) * 180) / Math.PI : 0;
    readout = `λ ${nm} nm · n ${refractiveIndex(nm).toFixed(3)} · bent ${bent.toFixed(1)}°`;
  }

  return (
    <div
      ref={container}
      style={{
        position: 'relative',
        height: 'clamp(300px, 42vw, 440px)',
        borderRadius: 20,
        overflow: 'hidden',
        background: STAGE,
        border: `1px solid ${alpha(white, 0.08)}`,
      }}
    >
      {failed && (
        <div style={{ ...label, inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
          The 3D prism needs WebGL. Use the sliders below.
        </div>
      )}
      <div style={{ ...label, top: 14, left: 16, right: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: tint, boxShadow: `0 0 12px ${tint}` }} />
        <span>
          {tint} · {readout}
        </span>
      </div>
      <div style={{ ...label, bottom: 12, left: 16, right: 16, color: alpha(white, 0.45) }}>
        Drag across the light or the card to pick · drag the glass to tip it
      </div>
    </div>
  );
}
