"use client";

import { useEffect, useRef } from "react";

// Flowing iridescent silk: a small WebGL fragment shader, no libraries. It only draws while on screen,
// renders at reduced resolution (it is soft anyway), and holds a single still frame under reduced motion.
const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = uv * vec2(r.x / r.y, 1.0) * 1.6;
  float a = t * 0.12;
  for (float i = 1.0; i < 5.0; i++) {
    p.x += 0.55 / i * sin(i * 2.1 * p.y + a + i * 0.7);
    p.y += 0.45 / i * cos(i * 1.7 * p.x + a * 1.3);
  }
  float w = 0.5 + 0.5 * sin(p.x + p.y);
  vec3 pink = vec3(1.0, 0.36, 0.78);
  vec3 blue = vec3(0.16, 0.30, 1.0);
  vec3 cyan = vec3(0.30, 0.92, 1.0);
  vec3 cream = vec3(1.0, 0.97, 0.93);
  vec3 col = mix(blue, pink, smoothstep(0.15, 0.85, w));
  col = mix(col, cyan, smoothstep(0.55, 1.0, sin(p.y * 1.3 - a) * 0.5 + 0.5) * 0.65);
  col = mix(col, cream, pow(1.0 - abs(uv.y - 0.72 + 0.08 * sin(p.x)), 18.0) * 0.9);
  col *= 0.72 + 0.28 * uv.y;
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

export default function Shader({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const gl = cv.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // CSS gradient underneath stays as the fallback
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r"), uT = gl.getUniformLocation(prog, "t");

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = false;
    const t0 = performance.now();
    const size = () => {
      const s = 0.5; // half resolution
      cv.width = Math.max(1, cv.clientWidth * s);
      cv.height = Math.max(1, cv.clientHeight * s);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const draw = (now: number) => {
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, still ? 8 : (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && !still) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    size();
    draw(t0);
    io.observe(cv);
    addEventListener("resize", size);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
