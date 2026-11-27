import { ImageResponse } from "next/og";
import { projects } from "../../../lib/content";

// Share card for each case study, in the project's colour. Rendered once per project at build.
export const dynamic = "force-static";
export const alt = "Case study — Shivastu Shrivastava";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required with output: "export": without it the build refuses this dynamic image route.
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56, background: p.color, color: p.on }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 1, borderBottom: `2px solid ${p.on}`, paddingBottom: 16 }}>
          <span>{`CASE STUDY [${String(i + 1).padStart(2, "0")}]`}</span>
          <span>{p.kind.toUpperCase()}</span>
          <span>SHIVASTU SHRIVASTAVA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -5, lineHeight: 0.9, textTransform: "uppercase" }}>{p.title}</div>
          <div style={{ marginTop: 28, fontSize: 40, fontWeight: 600 }}>{`${p.big} · ${p.caption}`}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24 }}>{p.stack.join(" · ")}</div>
      </div>
    ),
    size,
  );
}
