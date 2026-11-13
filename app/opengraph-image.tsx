import { ImageResponse } from "next/og";

// Preview card shown when the site link is shared (LinkedIn, WhatsApp, Slack). Rendered once at build.
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
          padding: 72,
          color: "#f3f2ed",
          backgroundColor: "#17171f",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(200,245,59,0.30), transparent 42%), radial-gradient(circle at 92% 78%, rgba(155,135,255,0.45), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 3, color: "#aaa9b9" }}>
          <span>SOFTWARE ENGINEER · BANGALORE</span>
          <span>SHIVASTUU.NETLIFY.APP</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Shivastu Shrivastava</div>
          <div style={{ marginTop: 32, fontSize: 40, color: "#c8f53b" }}>React · Next.js · TypeScript · Fintech</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#d6d5de" }}>Payments, KYC onboarding, SDKs and a design system, end to end.</div>
      </div>
    ),
    size,
  );
}
