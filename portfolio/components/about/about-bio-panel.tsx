"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import {useLocale, useTranslations} from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  siCss,
  siCplusplus,
  siDocker,
  siDotnet,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siPostgresql,
  siPython,
  siReact,
} from "simple-icons";
import type {AboutContentRecord, AboutTechnologyRecord} from "@/lib/about";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SIMPLE_ICON_MAP = {
  css: siCss,
  cplusplus: siCplusplus,
  docker: siDocker,
  dotnet: siDotnet,
  html5: siHtml5,
  javascript: siJavascript,
  nextdotjs: siNextdotjs,
  postgresql: siPostgresql,
  python: siPython,
  react: siReact,
} as const;

type AboutBioPanelProps = {
  about: AboutContentRecord;
  panelRef?: RefObject<HTMLDivElement | null>;
  intro?: boolean;
};

export function AboutBioPanel({about, panelRef, intro = false }: AboutBioPanelProps) {
  const locale = useLocale();
  const t = useTranslations("about");
  const stackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTechnology, setActiveTechnology] = useState<string | null>(null);
  const technologyRows = useMemo(
    () =>
      about.technologies.reduce<[AboutTechnologyRecord[], AboutTechnologyRecord[]]>(
        (rows, technology, index) => {
          rows[index % 2].push(technology);
          return rows;
        },
        [[], []],
      ),
    [about.technologies],
  );

  useLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack || intro) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stack-reveal]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.11,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stack,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-tech-chip]",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stack,
            start: "top 70%",
            once: true,
          },
        },
      );
    }, stack);

    return () => ctx.revert();
  }, [intro]);

  const handleTechnologyClick = (technologyName: string) => {
    setActiveTechnology((current) =>
      current === technologyName ? null : technologyName,
    );
    setIsPaused((current) => !current);
  };

  const renderTechnologyChip = (technology: AboutTechnologyRecord) => {
    const isActive = activeTechnology === technology.name;
    const icons = (technology.iconKeys ?? [])
      .map((iconKey) => SIMPLE_ICON_MAP[iconKey as keyof typeof SIMPLE_ICON_MAP])
      .filter(Boolean);

    return (
      <button
        key={technology.name}
        type="button"
        data-tech-chip
        onClick={() => handleTechnologyClick(technology.name)}
        className={[
          "group inline-flex min-w-[12rem] items-center justify-center gap-3 rounded-full border px-4 py-3 text-center transition-all duration-300",
          isActive
            ? "border-white/26 bg-white/[0.12] shadow-[0_12px_40px_rgba(255,255,255,0.08)]"
            : "border-white/8 bg-white/[0.04] hover:border-white/18 hover:bg-white/[0.07]",
        ].join(" ")}
        aria-pressed={isActive}
      >
        <div className="flex h-9 min-w-9 items-center justify-center gap-1 rounded-full bg-white/[0.05] px-2 text-sm font-medium tracking-[-0.04em] text-white">
          {icons.length ? (
            icons.map((icon) => (
              <svg
                key={`${technology.name}-${icon.title}`}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill={`#${icon.hex}`}
              >
                <path d={icon.path} />
              </svg>
            ))
          ) : (
            <span style={{ color: technology.color ?? "#ffffff" }}>
              {technology.fallback}
            </span>
          )}
        </div>
        <span className="text-sm text-white/88 transition-colors duration-300 group-hover:text-white">
          {technology.name}
        </span>
      </button>
    );
  };

  return (
    <section
      ref={panelRef}
      className={[
        "relative border border-white/10 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.05),transparent_30%),linear-gradient(180deg,#121212_0%,#0d0d0d_50%,#080808_100%)] text-[#eef2f1]",
        intro
          ? "min-h-screen overflow-hidden rounded-t-[3.5rem] will-change-transform"
          : "min-h-[140vh]",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_86%_4%,rgba(210,210,210,0.06),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="relative mx-auto flex w-full max-w-[96rem] flex-col gap-10 px-6 md:px-12">
        {intro ? (
          <div className="flex min-h-screen flex-col items-center justify-center pb-10 pt-6 md:pb-14 md:pt-8">
            <div className="grid w-full items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(28rem,1.05fr)]">
              <div className="max-w-3xl">
                <p className="text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[1.1] tracking-[-0.04em]">
                  {t("introTitle")}
                </p>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/66 md:text-lg">
                  {about.bio[locale as keyof typeof about.bio] ?? about.bio.en}
                </p>
              </div>

              <div className="w-full md:justify-self-end">
                <div className="relative h-[18rem] w-full max-w-[44rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] md:h-[26rem]">
                  <Image
                    src="/saturn.jpg"
                    alt={t("introImageAlt")}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,11,0.04)_0%,rgba(7,9,11,0.18)_100%)]" />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {!intro ? (
          <div ref={stackRef} className="border-t border-white/8 py-18 md:py-24">
            <div className="space-y-12">
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <p
                  data-stack-reveal
                  className="text-xs uppercase tracking-[0.35em] text-white/38"
                >
                  {t("stackEyebrow")}
                </p>
                <p
                  data-stack-reveal
                  className="mt-5 max-w-2xl text-[clamp(2.4rem,5vw,5rem)] font-light leading-[0.95] tracking-[-0.07em] text-white/96"
                >
                  {t("stackTitle")}
                </p>
                <p
                  data-stack-reveal
                  className="mt-5 max-w-xl text-base leading-7 text-white/60 md:text-lg"
                >
                  {t("stackDescription")}
                </p>
              </div>

              <div className="space-y-4" data-stack-reveal>
                {technologyRows.map((row, index) => (
                  <div
                    key={`technology-row-${index + 1}`}
                    className="overflow-hidden py-3"
                  >
                    <Marquee
                      autoFill
                      pauseOnHover={false}
                      speed={index === 0 ? 34 : 28}
                      direction={index === 0 ? "left" : "right"}
                      play={!isPaused}
                      gradient={false}
                    >
                      <div className="flex items-center gap-3 px-1">
                        {row.map(renderTechnologyChip)}
                      </div>
                    </Marquee>
                  </div>
                ))}
              </div>

              <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
                <p className="text-sm text-white/52">
                  {isPaused && activeTechnology
                    ? t("pausedMessage", {technology: activeTechnology})
                    : t("runningMessage")}
                </p>
                {activeTechnology ? (
                  <a
                    href={
                      about.technologies.find(
                        (technology) => technology.name === activeTechnology,
                      )?.href
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm text-white/84 transition-colors duration-300 hover:border-white/24 hover:text-white"
                  >
                    {t("openOnGithub", {technology: activeTechnology})}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
