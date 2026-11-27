import { ImageResponse } from "next/og";

// Preview card shown when the site link is shared (LinkedIn, WhatsApp, Slack). Rendered once at build.
// Mirrors the site: paper background, mono meta row, a big name, one black index block.
export const dynamic = "force-static";
export const alt = "Shivastu Shrivastava — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          color: "#0e0e0e",
          backgroundColor: "#f2f1ee",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 1, borderBottom: "2px solid #0e0e0e", paddingBottom: 16 }}>
          <span>[ SOFTWARE ENGINEER ]</span>
          <span>NIYO — BANGALORE</span>
          <span>SHIVASTUU.NETLIFY.APP</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 800, letterSpacing: -6, lineHeight: 0.88 }}>
            <span>SHIVASTU</span>
            <span>SHRIVASTAVA</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
          <span>React · Next.js · Flutter · Fintech</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", background: "#0e0e0e", color: "#f2f1ee", fontSize: 22 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#19c35a" }} />
            Available for work
          </span>
        </div>
      </div>
    ),
    size,
  );
}
