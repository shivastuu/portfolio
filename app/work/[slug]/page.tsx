import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../../lib/content";
import Nav from "../../../components/Nav";
import Contact from "../../../components/Contact";
import Cover from "../../../components/Covers";
import Flow from "../../../components/Flow";
import OtpDemo from "../../../components/demos/OtpDemo";
import RefreshDemo from "../../../components/demos/RefreshDemo";
import BillDemo from "../../../components/demos/BillDemo";
import SduiDemo from "../../../components/demos/SduiDemo";

// Projects with a live, in-browser re-creation of one piece of the work.
const DEMOS: Record<string, () => ReactNode> = {
  "credit-card-app": BillDemo,
  "design-system": OtpDemo,
  sdks: RefreshDemo,
  "react-native-app": SduiDemo,
};

type Props = { params: Promise<{ slug: string }> };

// One static HTML page per project at build time (the site is a static export).
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title} — Case study · Shivastu Shrivastava`;
  // The share image is the project's own card (opengraph-image.tsx in this folder).
  return { title, description: p.problem, openGraph: { title, description: p.problem, url: `/work/${p.slug}` } };
}

const pad = (n: number) => String(n).padStart(2, "0");

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="case__block" data-reveal="fade">
      <h2 className="case__label mono">
        [{pad(n)}] {title}
      </h2>
      <div className="case__text">{children}</div>
    </div>
  );
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const Demo = DEMOS[p.slug];

  return (
    <main className="case" style={{ "--c": p.color, "--on": p.on } as CSSProperties}>
      <Nav />
      <header className="case__head">
        <div className="case__top mono">
          <Link href="/#work" className="u">
            ← All work
          </Link>
          <span>
            Case study [{pad(i + 1)}/{pad(projects.length)}]
          </span>
          <span>{p.kind}</span>
        </div>
        <h1 className="case__title">{p.title}</h1>
        <div className="case__hero">
          <div>
            <p className="case__big">{p.big}</p>
            <p className="case__cap">{p.caption}</p>
          </div>
          <div className="case__cover">
            <Cover slug={p.slug} />
          </div>
        </div>
        <dl className="case__meta">
          <div>
            <dt className="mono">Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt className="mono">Status</dt>
            <dd>
              {p.status}
              {p.repo && (
                <a className="case__repo mono u" href={p.repo} target="_blank" rel="noreferrer">
                  Code on GitHub ↗
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt className="mono">Stack</dt>
            <dd>
              <ul className="tags">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </header>

      <div className="case__body">
        {[
          ["The problem", <p key="p">{p.problem}</p>],
          [
            "What I built",
            <ul key="b" className="case__list">
              {p.built.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>,
          ],
          ["How it fits together", <Flow key="f" steps={p.flow} />],
          ...(Demo ? [["Try it", <Demo key="d" />] as const] : []),
          ["The hard part", <p key="h">{p.hard}</p>],
          ["Result", <p key="r">{p.result}</p>],
        ].map(([title, body], n) => (
          <Block key={String(title)} n={n + 1} title={String(title)}>
            {body}
          </Block>
        ))}
      </div>

      <Link href={`/work/${next.slug}`} className="case__next" data-cursor="Next" style={{ "--c": next.color, "--on": next.on } as CSSProperties}>
        <span className="mono">Next case study [{pad(((i + 1) % projects.length) + 1)}]</span>
        <span className="case__next-title">
          {next.title} <span aria-hidden>↗</span>
        </span>
      </Link>

      <Contact />
    </main>
  );
}
