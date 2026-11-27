import type { HTMLAttributes, ReactNode } from "react";

type Box = HTMLAttributes<HTMLDivElement> & { "data-depth"?: string };

// Code-built "photography" for each project: a small, honest mock of what was actually built,
// using the facts in lib/content.ts. Elements with data-depth drift at different speeds on scroll (see Work.tsx).

function Phone({ children, className = "", ...rest }: Box) {
  return (
    <div className={`cv-phone ${className}`} {...rest}>
      <div className="cv-phone__bar">
        <span>9:41</span>
        <span className="cv-phone__isl" />
        <span>5G ▮</span>
      </div>
      {children}
    </div>
  );
}

function Window({ title, children, className = "", dark = false, ...rest }: Box & { title: string; dark?: boolean }) {
  return (
    <div className={`cv-win ${dark ? "cv-win--dark" : ""} ${className}`} {...rest}>
      <div className="cv-win__bar">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

// A brushed-metal card. "black" is graphite metal, "steel" is a platinum finish. Layers, bottom to top:
// base gradient, brushed grain, an engraved guilloché rosette, and a light that follows the pointer
// (--mx / --my, set by Cursor.tsx on anything marked data-metal) plus a slow sheen.
function CreditCard({ className = "", finish = "black" }: { className?: string; finish?: "black" | "steel" }) {
  return (
    <div className={`cv-card metal metal--${finish} ${className}`}>
      <i className="metal__grain" />
      <i className="metal__rosette" />
      <i className="metal__light" />
      <div className="cv-card__top">
        <span className="chip" />
        <svg className="cv-card__wave" viewBox="0 0 24 24" aria-hidden>
          <path d="M8 6.5a8 8 0 0 1 0 11M11.5 4.5a11 11 0 0 1 0 15M15 2.5a14 14 0 0 1 0 19" />
        </svg>
      </div>
      <p className="cv-card__num engrave">•••• •••• •••• 4821</p>
      <div className="cv-card__bottom">
        <span className="engrave">Shivastu Shrivastava</span>
        <span className="engrave cv-card__since">
          <small>Since</small> 01/25
        </span>
      </div>
    </div>
  );
}

const CardApp = () => (
  <>
    <Phone className="cv-at-r" data-depth="0.6">
      <div className="cv-scr">
        <p className="cv-muted">Available limit</p>
        <p className="cv-big">₹1,84,500</p>
        <CreditCard className="cv-card--mini" />
        <div className="cv-actions">
          {["Lock", "Limits", "Pay bill", "Statement"].map((a) => (
            <span key={a}>
              <i />
              {a}
            </span>
          ))}
        </div>
        <p className="cv-muted cv-gap">Transactions</p>
        {[
          ["Electricity bill", "− ₹2,140"],
          ["Coffee", "− ₹240"],
          ["Repayment", "+ ₹12,000"],
        ].map(([a, b]) => (
          <div className="cv-row" key={a}>
            <span>{a}</span>
            <b>{b}</b>
          </div>
        ))}
      </div>
    </Phone>
    <div data-depth="1.4" className="cv-float cv-at-l" data-metal>
      <CreditCard className="cv-card--hero" />
    </div>
  </>
);

const steps = [
  ["PAN", "done"],
  ["Video KYC", "done"],
  ["CKYC", "now"],
  ["Consent", ""],
  ["Card issued", ""],
];

const Onboarding = () => (
  <>
    <Phone className="cv-at-l" data-depth="0.6">
      <div className="cv-scr">
        <div className="cv-progress">
          <i style={{ width: "60%" }} />
        </div>
        <p className="cv-muted">Step 3 of 5</p>
        <p className="cv-title">Checking your KYC</p>
        <div className="cv-input">
          <span>PAN</span>
          <b>ABCDE1234F</b>
          <em>✓</em>
        </div>
        <ul className="cv-steps">
          {steps.map(([s, st]) => (
            <li key={s} className={st}>
              <i />
              {s}
            </li>
          ))}
        </ul>
        <span className="cv-btn">Continue</span>
      </div>
    </Phone>
    <div className="cv-map cv-at-r" data-depth="1.3">
      <p className="cv-mono">CKYC router</p>
      <div className="cv-map__cols">
        <ul>
          {Array.from({ length: 12 }, (_, i) => (
            <li key={i}>S{String(i + 1).padStart(2, "0")}</li>
          ))}
        </ul>
        <svg viewBox="0 0 60 180" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M0 ${7.5 + i * 15} C30 ${7.5 + i * 15} 30 ${15 + Math.floor(i / 2) * 30} 60 ${15 + Math.floor(i / 2) * 30}`} />
          ))}
        </svg>
        <ul className="cv-map__out">
          {["Start", "Retry", "Video", "Wait", "Reject", "Done"].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <p className="cv-big">12 → 6</p>
    </div>
  </>
);

const DesignSystem = () => (
  <div className="cv-board">
    <div className="cv-tile cv-tile--a" data-depth="0.5">
      <p className="cv-mono">Button</p>
      <span className="cv-btn">Primary</span>
      <span className="cv-btn cv-btn--ghost">Secondary</span>
    </div>
    <div className="cv-tile cv-tile--b" data-depth="1.2">
      <p className="cv-mono">OTP input</p>
      <div className="cv-otp">
        {["4", "8", "2", "6", "", ""].map((d, i) => (
          <span key={i} className={i === 4 ? "is-focus" : ""}>
            {d}
          </span>
        ))}
      </div>
    </div>
    <div className="cv-tile cv-tile--c" data-depth="0.9">
      <p className="cv-mono">Tokens</p>
      <div className="cv-swatches">
        {["#111", "#1d3a8a", "#d4a24c", "#e9dcc6", "#0e6b4f", "#fff"].map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
      </div>
    </div>
    <div className="cv-tile cv-tile--d" data-depth="1.5">
      <p className="cv-mono">Switch · Chip</p>
      <span className="cv-switch" />
      <span className="cv-chip">UPI</span>
      <span className="cv-chip">Card</span>
    </div>
    <div className="cv-tile cv-tile--e" data-depth="0.7">
      <p className="cv-mono">Sheet</p>
      <div className="cv-sheet">
        <i />
        <b>Confirm payment</b>
        <span>₹2,140 to BESCOM</span>
        <span className="cv-btn">Pay</span>
      </div>
    </div>
    <p className="cv-stamp" data-depth="1.8">
      22/49
      <small>components built</small>
    </p>
  </div>
);

const Sdks = () => (
  <>
    <Window title="host-app.ts" dark className="cv-at-l cv-code" data-depth="0.6">
      <pre>
        <code>
          <b className="k">import</b> {"{ "}
          <b className="f">AuthModal</b>
          {" }"} <b className="k">from</b> <b className="s">&quot;auth-sdk&quot;</b>;{"\n\n"}
          <b className="k">const</b> session = <b className="k">await</b> <b className="f">AuthModal</b>({"{"}
          {"\n"}  product: <b className="s">&quot;forex&quot;</b>,{"\n"}  onSuccess: (user) =&gt; <b className="f">route</b>(user),{"\n"}
          {"}"});{"\n\n"}
          <b className="c">{"// refresh is single-flight across tabs"}</b>
          {"\n"}
          <b className="k">await</b> navigator.locks.<b className="f">request</b>(<b className="s">&quot;refresh&quot;</b>, rotate);
        </code>
      </pre>
    </Window>
    <div className="cv-modal cv-at-r" data-depth="1.4">
      <p className="cv-title">Login with OTP</p>
      <p className="cv-muted">Sent to +91 ••••• •4821</p>
      <div className="cv-otp">
        {["3", "1", "9", "0", "7", "2"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <span className="cv-btn">Verify</span>
      <p className="cv-mono cv-lock">🔒 HttpOnly session</p>
    </div>
  </>
);

const Compliance = () => (
  <Window title="Risk weights · change #284" className="cv-at-c cv-table" data-depth="0.8">
    <div className="cv-trow cv-trow--h">
      <span>Rule</span>
      <span>Before</span>
      <span>After</span>
    </div>
    {[
      ["High-risk country", "40", "55"],
      ["PEP match", "30", "30"],
      ["Txn velocity", "15", "20"],
      ["New device", "10", "5"],
    ].map(([r, a, b]) => (
      <div className="cv-trow" key={r}>
        <span>{r}</span>
        <span className={a !== b ? "was" : ""}>{a}</span>
        <span className={a !== b ? (Number(b) > Number(a) ? "up" : "down") : ""}>{b}</span>
      </div>
    ))}
    <div className="cv-flow">
      <span className="cv-who">
        <i>AK</i> Maker
      </span>
      <span className="cv-arrow">→</span>
      <span className="cv-who">
        <i>RS</i> Checker
      </span>
      <span className="cv-btn">Approve</span>
    </div>
  </Window>
);

const sections = ["#1d3a8a", "#d4a24c", "#e9dcc6", "#0e6b4f", "#7b4a2a", "#c83223"];
const NativeApp = () => (
  <>
    <Phone className="cv-at-l" data-depth="0.6">
      <div className="cv-scr">
        <p className="cv-title">Home</p>
        <div className="cv-stack">
          {sections.map((c, i) => (
            <i key={c} style={{ background: c, height: i === 0 ? "5.8em" : i % 2 ? "3.1em" : "4.2em" }} />
          ))}
        </div>
        <p className="cv-mono">13 sections · from CMS</p>
      </div>
    </Phone>
    <Phone className="cv-at-r cv-phone--dark" data-depth="1.3">
      <div className="cv-scr">
        <p className="cv-title">Debit card</p>
        {[
          ["Lock card", true],
          ["Online payments", true],
          ["International", false],
          ["Contactless", true],
        ].map(([l, on]) => (
          <div className="cv-row" key={String(l)}>
            <span>{l}</span>
            <span className={`cv-switch ${on ? "" : "is-off"}`} />
          </div>
        ))}
        <p className="cv-mono cv-gap">Every change: OTP</p>
      </div>
    </Phone>
  </>
);

const RedCell = () => (
  <>
    <Window title="redcell — zsh" dark className="cv-at-l cv-term" data-depth="0.6">
      <pre>
        <code>
          <b className="s">$</b> redcell run --agent qwen-7b --guardrails off{"\n"}
          [inject] poisoned tool description <b className="bad">BREACH</b>
          {"\n"}[exfil ] secret in system prompt <b className="bad">BREACH</b>
          {"\n"}[render] auto-loading image .... <b className="bad">BREACH</b>
          {"\n"}attack success <b className="bad">83%</b>
          {"\n\n"}
          <b className="s">$</b> redcell run --agent qwen-7b --guardrails on{"\n"}
          [inject] poisoned tool description <b className="ok">BLOCKED</b>
          {"\n"}[exfil ] secret in system prompt <b className="ok">BLOCKED</b>
          {"\n"}attack success <b className="ok">0%</b>
          <span className="cv-caret" />
        </code>
      </pre>
    </Window>
    <div className="cv-bars cv-at-r" data-depth="1.4">
      <p className="cv-mono">Static attacks · 7B agent</p>
      <div className="cv-bars__plot">
        <span style={{ height: "83%" }}>
          <b>83%</b>
        </span>
        <span style={{ height: "2%" }}>
          <b>0%</b>
        </span>
      </div>
      <div className="cv-bars__x">
        <span>Without</span>
        <span>With guardrails</span>
      </div>
    </div>
  </>
);

const COVERS: Record<string, () => ReactNode> = {
  "credit-card-app": CardApp,
  "onboarding-pwa": Onboarding,
  "design-system": DesignSystem,
  sdks: Sdks,
  "compliance-workbench": Compliance,
  "react-native-app": NativeApp,
  redcell: RedCell,
};

export default function Cover({ slug }: { slug: string }) {
  const C = COVERS[slug];
  return (
    <div className={`cover cover--${slug}`} aria-hidden>
      <div className="cover__glow" />
      {C && <C />}
    </div>
  );
}

export { CreditCard };
