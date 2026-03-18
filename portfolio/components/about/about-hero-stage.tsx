"use client";

import { useLayoutEffect, useRef } from "react";
import {useTranslations} from "next-intl";
import gsap from "gsap";
import type { RefObject } from "react";

type AboutHeroStageProps = {
  heroRef: RefObject<HTMLDivElement | null>;
};

export function AboutHeroStage({ heroRef }: AboutHeroStageProps) {
  const t = useTranslations("about");
  const hoverAreaRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLSpanElement>(null);
  const developerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hoverArea = hoverAreaRef.current;
    const about = aboutRef.current;
    const developer = developerRef.current;

    if (!hoverArea || !about || !developer) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(developer, {
        opacity: 0,
        yPercent: 55,
        filter: "blur(10px)",
      });

      const timeline = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.5, ease: "power3.out" },
        })
        .to(
          about,
          {
            opacity: 0,
            yPercent: -55,
            filter: "blur(10px)",
          },
          0
        )
        .to(
          developer,
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
          },
          0.08
        );

      const handleEnter = () => timeline.play();
      const handleLeave = () => timeline.reverse();

      hoverArea.addEventListener("mouseenter", handleEnter);
      hoverArea.addEventListener("mouseleave", handleLeave);

      return () => {
        hoverArea.removeEventListener("mouseenter", handleEnter);
        hoverArea.removeEventListener("mouseleave", handleLeave);
        timeline.kill();
      };
    }, hoverArea);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="absolute inset-0 will-change-transform">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.04),transparent_18%),linear-gradient(180deg,#07080d_0%,#05060a_56%,#040509_100%)]" />

      <div className="absolute left-1/2 top-[18vh] h-[46vh] w-[74vw] max-w-[1100px] -translate-x-1/2 md:top-[17vh] md:h-[52vh] md:w-[70vw]">
        <div className="absolute inset-0 rounded-[50%] border border-white/4 blur-[2px]" />
        <div className="absolute inset-x-[24%] top-[10%] h-[16%] rounded-full bg-white/6 blur-3xl" />
        <div className="absolute left-1/2 top-[42%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_14%,rgba(5,6,8,0.14)_48%,rgba(5,6,8,0.88)_100%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-28 md:px-12 md:pt-32">
        <div
          ref={hoverAreaRef}
          className="relative flex h-[52vh] w-[96vw] max-w-[92rem] items-center justify-center overflow-hidden md:h-[60vh]"
        >
          <h1 className="relative z-10 grid place-items-center text-[clamp(5.75rem,15vw,11.5rem)] font-light uppercase leading-[0.8] tracking-[-0.1em] text-white">
            <span ref={aboutRef} className="col-start-1 row-start-1 block will-change-transform">
              {t("heroPrimary")}
            </span>
            <span
              ref={developerRef}
              className="col-start-1 row-start-1 block whitespace-nowrap will-change-transform"
            >
              {t("heroSecondary")}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
