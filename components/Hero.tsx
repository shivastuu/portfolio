"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { hero, links, stats } from "../lib/content";
import { useClock } from "../lib/useClock";
import { scramble } from "../lib/scramble";
import { CreditCard } from "./Covers";
import Nav from "./Nav";

const DESKTOP = "(min-width: 900px)";
// Final size of the unfolded screen; the CSS uses the same numbers (--ow / --oh).
const openW = () => Math.min(1240, innerWidth * 0.92);
const openH = () => Math.min(760, innerHeight * 0.82);
const closedH = () => Math.min(700, innerHeight * 0.78);

function Stats() {
  return (
    <div className="band">
      <p className="mono band__head">Two years in numbers</p>
      <ul className="band__list">
        {stats.map((s) => (
          <li key={s.label}>
            <b>
              <span data-to={s.to}>{s.to}</span>
              {s.suffix}
            </b>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Intro() {
  return (
    <>
      <p className="mono intro__role">{hero.eyebrow}</p>
      <p className="intro__name">
        Shivastu
        <br />
        Shrivastava
      </p>
      <p className="intro__lede">{hero.lede}</p>
      <div className="intro__cta">
        <a href="#work" className="btn btn--dark">
          See the work ↗
        </a>
        <a href="#contact" className="btn">
          Say hello
        </a>
      </div>
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const time = useClock();
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" }).format(new Date()));
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Resolved against this component's root, so it works whenever it runs (it may run later, from an event).
      const q = gsap.utils.selector(root);
      const intro = () => {
        q<HTMLElement>("[data-scramble]").forEach((el) => scramble(el, 1100));
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(q(".hero__w > span"), { yPercent: 0, duration: 1.4, stagger: 0.12 })
          .to(q(".device"), { y: 0, rotateX: 0, autoAlpha: 1, duration: 1.6 }, 0.15)
          .from(q(".hero__glow"), { scale: 0.3, autoAlpha: 0, duration: 2 }, 0.3)
          .to(q(".lock__note"), { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12 }, 0.9)
          .to(q("[data-in]"), { y: 0, autoAlpha: 1, duration: 1, stagger: 0.05 }, 0.5);
      };

      // Phones skip the entrance: the hero paints immediately, which keeps first load fast.
      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        gsap.set(".hero__w > span", { yPercent: 105, visibility: "visible" });
        gsap.set(".device", { y: "35vh", rotateX: 28, autoAlpha: 0, transformPerspective: 1600 });
        gsap.set(".lock__note", { y: 30, autoAlpha: 0 });
        gsap.set(".hero [data-in]", { y: 16, autoAlpha: 0 });
        // The preloader (first visit) fires intro:done when it has parted; later visits start straight away.
        if (document.documentElement.classList.contains("is-loading")) addEventListener("intro:done", intro, { once: true });
        else intro();
        return () => removeEventListener("intro:done", intro);
      });

      // Desktop: pin the stage and unfold the phone into a wide screen as you scroll.
      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const stage = root.current!.querySelector<HTMLElement>(".hero__stage")!;
        const nums = gsap.utils.toArray<HTMLElement>(".device .band [data-to]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => stage.classList.toggle("is-open", st.progress > 0.3),
          },
        });
        tl.to(".hero__name", { scale: 1.12, autoAlpha: 0, duration: 0.35 }, 0)
          .to(".hero__glow", { scale: 2.2, autoAlpha: 0.25, duration: 0.4 }, 0)
          .to(".hero__label", { autoAlpha: 0, duration: 0.15 }, 0)
          .fromTo(".device", { rotateY: 0 }, { rotateY: -14, duration: 0.18, ease: "power1.in" }, 0)
          .to(".device", { rotateY: 0, duration: 0.22, ease: "power1.out" }, 0.18)
          .fromTo(".device", { width: 360, height: closedH, borderRadius: 46 }, { width: openW, height: openH, borderRadius: 30, duration: 0.4, ease: "power2.inOut" }, 0)
          .to(".device__crease", { autoAlpha: 1, duration: 0.12 }, 0.04)
          .to(".device__crease", { autoAlpha: 0, duration: 0.14 }, 0.32)
          .to(".lock", { autoAlpha: 0, scale: 0.94, duration: 0.18 }, 0.08)
          .fromTo(".open", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.22)
          .from(".open .intro__name", { yPercent: 40, autoAlpha: 0, duration: 0.2 }, 0.3)
          .from(".open__card", { yPercent: 60, rotate: -30, autoAlpha: 0, duration: 0.3 }, 0.28)
          .fromTo(".device .band", { yPercent: 100 }, { yPercent: 0, duration: 0.25, ease: "power2.out" }, 0.55)
          .add(() => {}, 1);
        nums.forEach((el) => {
          const to = Number(el.dataset.to), n = { v: 0 };
          tl.fromTo(n, { v: 0 }, { v: to, duration: 0.3, onUpdate: () => void (el.textContent = String(Math.round(n.v))) }, 0.6);
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <Nav home />

      <section className="hero" id="top">
        <h1 className="sr-only">Shivastu Shrivastava, software engineer</h1>
        <div className="hero__stage">
          <p className="hero__label mono" data-scramble>
            [ Software engineer ] Niyo — Bangalore
          </p>
          <p className="hero__label hero__label--r mono" data-in>
            Scroll to unfold ↓
          </p>

          <div className="hero__name" aria-hidden>
            <span className="hero__w hero__w--a">
              <span>Shivastu</span>
            </span>
            <span className="hero__w hero__w--b">
              <span>Shrivastava</span>
            </span>
          </div>

          <div className="hero__glow" aria-hidden />
          <div className="device">
            <div className="device__screen">
              <div className="lock">
                <div className="lock__wall" aria-hidden />
                <div className="lock__bar mono">
                  <span className="tnum">{time || "--:--"}</span>
                  <span className="lock__isl" />
                  <span>5G ▮▮</span>
                </div>
                <p className="lock__date">{date || " "}</p>
                <p className="lock__time tnum">{time || "--:--"}</p>
                <p className="lock__role">{hero.role}</p>
                <ul className="lock__notes">
                  {hero.notes.map((n) => {
                    const body = (
                      <>
                        <i className={`lock__icon lock__icon--${n.icon}`} aria-hidden />
                        <span>
                          <b>{n.app}</b>
                          <small className="mono">{n.when}</small>
                          <span>{n.text}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={n.app} className="lock__note">
                        {n.href.startsWith("#") ? (
                          <a href={n.href} data-cursor="Open">
                            {body}
                          </a>
                        ) : (
                          <Link href={n.href} data-cursor="Open">
                            {body}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="lock__dock">
                  <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
                    </svg>
                  </a>
                  <span className="lock__hint mono">Scroll to unfold</span>
                  <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="open">
                <div className="open__copy">
                  <Intro />
                </div>
                <div className="open__art" aria-hidden data-metal>
                  <div className="lock__wall" />
                  <div className="open__card">
                    <CreditCard className="cv-card--hero" />
                  </div>
                  <p className="open__tag mono">Fintech · end to end</p>
                </div>
                <Stats />
              </div>
              <i className="device__crease" aria-hidden />
            </div>
          </div>
        </div>

        <div className="hero__m">
          <Intro />
          <Stats />
        </div>
      </section>
    </div>
  );
}
