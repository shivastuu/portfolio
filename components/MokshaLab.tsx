"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { contrastRatio, createTheme, generateScale, readableTextOn } from "@moksha-ui/tokens";
import {
  BankCard,
  Button,
  Chip,
  OtpField,
  ProgressBar,
  RollingAmount,
  SegmentedControl,
  Sparkline,
  Switch,
  ThemeProvider,
  TransactionRow,
} from "@moksha-ui/core";
import { ScrollTrigger } from "../lib/gsap";
import { moksha } from "../lib/content";
import { copy } from "../lib/theme";

// The prism from @moksha-ui/core/prism (three.js) in its own chunk, so the screens below don't wait for it.
const Prism = dynamic(() => import("@moksha-ui/core/prism").then((m) => m.PrismColorPicker), {
  ssr: false,
  loading: () => <div className="mk__stage-poster" aria-hidden />,
});

// Geist, like the rest of the site.
const font = { typography: { fontFamily: { web: "var(--font-sans), system-ui, sans-serif" } } };

// Every theme ThemeProvider sees adds a stylesheet, so while the prism is dragged the screens re-theme a few
// times a second (and always land on the final colour) rather than on every frame.
function useThrottled<T>(value: T, ms: number) {
  const [shown, setShown] = useState(value);
  const last = useRef(0);
  useEffect(() => {
    const id = setTimeout(
      () => {
        last.current = performance.now();
        setShown(value);
      },
      Math.max(0, last.current + ms - performance.now()),
    );
    return () => clearTimeout(id);
  }, [value, ms]);
  return shown;
}

export default function MokshaLab({ brand, onBrand }: { brand: string; onBrand: (hex: string) => void }) {
  const themed = useThrottled(brand, 160);
  const theme = useMemo(() => createTheme({ brandColor: themed, foundations: font }), [themed]);
  const scale = useMemo(() => generateScale(brand), [brand]);
  const [copied, setCopied] = useState(false);
  const code = `createTheme({ brandColor: '${brand}' })`;
  const ratio = (s: "light" | "dark") => contrastRatio(theme.themes[s].colors.primary, theme.themes[s].colors.textOnPrimary).toFixed(1);

  // The lab replaces a placeholder of about the same height; re-measure the pinned sections below once it's in.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <>
      <div className="mk__bench">
        <div className="mk__stage">
          <ThemeProvider colorScheme="dark">
            <Prism value={brand} onChange={onBrand} />
          </ThemeProvider>
        </div>

        <div className="mk__panel">
          <p className="mono mk__k">Brand colour</p>
          <div className="mk__swatches" role="group" aria-label="Brand colour presets">
            {moksha.swatches.map((s) => (
              <button
                key={s.hex}
                type="button"
                className="mk__swatch"
                style={{ background: s.hex }}
                aria-pressed={brand.toUpperCase() === s.hex}
                aria-label={`${s.name}, ${s.hex}`}
                onClick={() => onBrand(s.hex)}
              />
            ))}
          </div>

          <div className="mk__code">
            <code>
              <span className="mk__fn">createTheme</span>({"{ "}brandColor: <b>&apos;{brand}&apos;</b>
              {" })"}
            </code>
            <button type="button" className="mono" onClick={async () => setCopied(await copy(code))} aria-live="polite">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="mono mk__k">10-step OKLCH scale</p>
          <ol className="mk__scale" aria-label={`Scale generated from ${brand}`}>
            {Object.entries(scale).map(([step, hex]) => (
              <li key={step} style={{ background: hex, color: readableTextOn(hex) }}>
                <span>{step}</span>
                <span>{hex}</span>
              </li>
            ))}
          </ol>

          <dl className="mk__aa">
            <div>
              <dt className="mono">Light</dt>
              <dd>
                <i style={{ background: theme.themes.light.colors.primary }} />
                {ratio("light")}:1
              </dd>
            </div>
            <div>
              <dt className="mono">Dark</dt>
              <dd>
                <i style={{ background: theme.themes.dark.colors.primary }} />
                {ratio("dark")}:1
              </dd>
            </div>
            <div>
              <dt className="mono">WCAG</dt>
              <dd>AA ✓</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="mk__live mono">
        <i aria-hidden /> Live: real @moksha-ui/core components, re-themed by the colour you pick
      </p>
      <div className="mk__screens">
        <Screen scheme="light" theme={theme} caption="Light · wallet home">
          <Wallet />
        </Screen>
        <Screen scheme="dark" theme={theme} caption="Dark · confirm payment">
          <Confirm />
        </Screen>
      </div>
    </>
  );
}

function Screen({ scheme, theme, caption, children }: { scheme: "light" | "dark"; theme: ReturnType<typeof createTheme>; caption: string; children: React.ReactNode }) {
  return (
    <figure className={`mk__screen mk__screen--${scheme}`}>
      <ThemeProvider theme={theme} colorScheme={scheme}>
        <div className="mk__app">
          <div className="mk__bar mono" aria-hidden>
            <span>9:41</span>
            <span>●●● ▮</span>
          </div>
          {children}
        </div>
      </ThemeProvider>
      <figcaption className="mono">{caption}</figcaption>
    </figure>
  );
}

function Wallet() {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <div className="mk__row">
        <div>
          <p className="mk__muted">Total balance</p>
          <RollingAmount value={248560.75} size="xl" />
        </div>
        <Sparkline data={[12, 18, 15, 22, 19, 27, 31]} accessibilityLabel="Balance this week, rising" width={88} height={34} tone="primary" />
      </div>
      <BankCard last4="4821" holder="Shivastu S." expiry="08/29" label="Moksha" finish="brand" />
      <div className="mk__actions">
        <Button fullWidth>Send money</Button>
        <Button variant="secondary" fullWidth>
          Add money
        </Button>
      </div>
      <div className="mk__chips">
        {["All", "Bills", "UPI"].map((c) => (
          <Chip key={c} label={c} size="sm" selected={filter === c} onSelectedChange={() => setFilter(c)} />
        ))}
      </div>
      <div className="mk__list">
        <TransactionRow name="Blue Tokai" amount={420} direction="debit" time="Today, 9:12 am" method="UPI" />
        <TransactionRow name="Salary" amount={182000} direction="credit" time="1 Nov" method="NEFT" />
      </div>
    </>
  );
}

function Confirm() {
  return (
    <>
      <div>
        <p className="mk__muted">Paying Croma Retail</p>
        <RollingAmount value={12499} size="xl" decimals={0} />
      </div>
      <SegmentedControl
        accessibilityLabel="How often"
        defaultValue="once"
        options={[
          { value: "once", label: "Once" },
          { value: "monthly", label: "Monthly" },
          { value: "emi", label: "EMI" },
        ]}
      />
      <OtpField label="Code sent to •• 21" defaultValue="4821" helperText="Resend in 0:24" />
      <ProgressBar value={62} label="Monthly limit used" />
      <Switch label="Remember this device" description="Skip the code for 30 days" defaultChecked />
      <Button fullWidth size="lg">
        Pay ₹12,499
      </Button>
    </>
  );
}
