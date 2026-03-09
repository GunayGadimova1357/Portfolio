"use client";

import { useState } from "react";
import { useMotionValue } from "motion/react";
import type { MouseEvent, RefObject } from "react";
import {
  CardPattern,
  generateRandomString,
} from "@/components/ui/evervault-card";

type AboutHeroStageProps = {
  heroRef: RefObject<HTMLDivElement | null>;
};

export function AboutHeroStage({ heroRef }: AboutHeroStageProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [randomString, setRandomString] = useState(() =>
    generateRandomString(9000)
  );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
    setRandomString(generateRandomString(9000));
  };

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
          onMouseMove={handleMouseMove}
          className="group/card relative flex h-[52vh] w-[96vw] max-w-[92rem] items-center justify-center md:h-[60vh]"
        >
          <CardPattern
            mouseX={mouseX}
            mouseY={mouseY}
            randomString={randomString}
          />
          <h1 className="relative z-10 text-[clamp(5.75rem,15vw,11.5rem)] font-light uppercase leading-[0.8] tracking-[-0.1em] text-white">
            About
          </h1>
        </div>
      </div>
    </div>
  );
}
