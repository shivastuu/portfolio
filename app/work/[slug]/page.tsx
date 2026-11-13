import type { Metadata, ResolvingMetadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../../lib/content";
import Nav from "../../../components/Nav";
import Contact from "../../../components/Contact";
import { Lines } from "../../../components/Motion";

type Props = { params: Promise<{ slug: string }> };

// One static HTML page per project at build time (the site is a static export).
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title} — Case study · Shivastu Shrivastava`;
  // A page-level openGraph replaces the layout's, so carry over the shared preview image.
  const images = (await parent).openGraph?.images;
  return { title, description: p.problem, openGraph: { title, description: p.problem, url: `/work/${p.slug}`, images } };
}

const pad = (n: number) => String(n).padStart(2, "0");

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="case__block" data-reveal="fade">
      <p className="label">
        ({pad(n)}) {title}
      </p>
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

  return (
    <main className="case" style={{ "--h": p.hue } as CSSProperties}>
      <Nav />
      <header className="case__head">
        <Link href="/#work" className="label case__back">
          ← All work
        </Link>
        <p className="label" data-scramble>
          (Case study {pad(i + 1)} / {pad(projects.length)} — {p.kind})
        </p>
        <h1 className="case__title" data-reveal="line">
          <Lines lines={[p.title]} />
        </h1>
        <div className="case__hero" data-reveal="fade">
          <p className="milestone__big">{p.big}</p>
          <p className="milestone__caption">{p.caption}</p>
        </div>
        <dl className="case__meta" data-reveal="fade">
          <div>
            <dt className="label">Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt className="label">Status</dt>
            <dd>{p.status}</dd>
          </div>
          <div>
            <dt className="label">Stack</dt>
            <dd>
              <ul className="chips">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </header>

      <div className="case__body">
        <Block n={1} title="The problem">
          <p>{p.problem}</p>
        </Block>
        <Block n={2} title="What I built">
          <ul className="card__points">
            {p.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Block>
        <Block n={3} title="The hard part">
          <p>{p.hard}</p>
        </Block>
        <Block n={4} title="Result">
          <p>{p.result}</p>
        </Block>
      </div>

      <Link href={`/work/${next.slug}`} className="case__next">
        <span className="label">Next case study</span>
        <span className="case__next-title">
          {next.title} <span aria-hidden>→</span>
        </span>
      </Link>

      <Contact />
    </main>
  );
}
