"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutBioPanel } from "@/components/about/about-bio-panel";
import { AboutHeroStage } from "@/components/about/about-hero-stage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const hero = heroRef.current;
    const panel = panelRef.current;

    if (!section || !hero || !panel) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(panel, {
        yPercent: 100,
        borderTopLeftRadius: 56,
        borderTopRightRadius: 56,
        boxShadow: "0 -24px 80px rgba(0,0,0,0)",
      });

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
        .to(
          hero,
          {
            scale: 0.92,
            yPercent: -8,
            opacity: 0,
          },
          0.08
        )
        .to(
          panel,
          {
            yPercent: 0,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            boxShadow: "0 -30px 120px rgba(0,0,0,0.28)",
          },
          0.36
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#f3efe7]">
      <section
        ref={sectionRef}
        className="relative h-screen overflow-clip bg-[#050608] text-white"
      >
        <AboutHeroStage heroRef={heroRef} />
        <AboutBioPanel panelRef={panelRef} intro />
      </section>

      <AboutBioPanel />
    </div>
  );
}
