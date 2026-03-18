"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene";
import StickyScrollRevealDemo from "@/components/sticky-scroll-reveal-demo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Sections() {
  const t = useTranslations("home");
  const pageRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [moonProgress, setMoonProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setMoonProgress(value);
  });

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reveal-hero]",
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-hero-section]",
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-reveal-about]",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-reveal-projects]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-projects-head]",
            start: "top 84%",
            once: true,
          },
        },
      );
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-black text-white">
      <section data-hero-section className="relative min-h-screen overflow-hidden">
        <div className="sticky top-0 h-screen overflow-hidden">
          <Scene className="absolute inset-0" starOpacity={0.42} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.38)_65%,#000000_100%)]" />

          <div className="relative z-10 flex h-full items-end px-8 pb-10 md:px-16 md:pb-14">
            <div className="max-w-3xl">
              <p
                data-reveal-hero
                className="mb-5 text-sm uppercase tracking-[0.35em] text-white/45"
              >
                {t("heroEyebrow")}
              </p>
              <h1
                data-reveal-hero
                className="max-w-2xl text-5xl font-light tracking-[-0.05em] md:text-7xl"
              >
                {t("heroTitle")}
              </h1>
              <p
                data-reveal-hero
                className="mt-6 max-w-xl text-base leading-7 text-white/62 md:text-lg"
              >
                {t("heroDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={aboutRef}
        className="relative min-h-[130vh] overflow-hidden bg-black md:min-h-[145vh]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <Scene
            className="absolute inset-0"
            starOpacity={0.1 + moonProgress * 0.12}
          />
          <div
            className="absolute inset-[-8%] z-0"
            style={{
              transform: `translate3d(${(0.5 - moonProgress) * 6}%, ${(0.5 - moonProgress) * -10}%, 0) scale(${1.18 + moonProgress * 0.1})`,
            }}
          >
            <Image
              src="/themoon.jpg"
              alt={t("moonLabel")}
              fill
              priority
              className="object-contain object-center select-none opacity-[0.94]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.38)_28%,rgba(0,0,0,0.64)_60%,rgba(0,0,0,0.9)_100%)]" />
          </div>

          <div
            data-reveal-about
            className="absolute right-8 top-24 z-10 text-xs uppercase tracking-[0.35em] text-white/70 md:right-16"
          >
            {t("moonLabel")}
          </div>

          <div className="relative z-10 flex h-full items-end px-8 pb-24 md:px-16 md:pb-28">
            <div className="max-w-3xl">
              <h2
                data-reveal-about
                className="text-5xl font-light tracking-[-0.05em] md:text-7xl"
              >
                {t("aboutTitle")}
              </h2>
              <p
                data-reveal-about
                className="mt-8 max-w-4xl text-lg leading-8 text-white/74 md:text-[1.75rem] md:leading-[1.45]"
              >
                {t("aboutDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div
          data-projects-head
          className="mx-auto w-full max-w-6xl px-8 pt-6 md:px-16 md:pt-10"
        >
          <p
            data-reveal-projects
            className="text-xs uppercase tracking-[0.35em] text-white/45"
          >
            {t("projectsEyebrow")}
          </p>
          <h2
            data-reveal-projects
            className="mt-3 text-4xl font-light tracking-[-0.04em] text-white md:text-6xl"
          >
            {t("projectsTitle")}
          </h2>
        </div>

        <StickyScrollRevealDemo />
      </section>
    </div>
  );
}
