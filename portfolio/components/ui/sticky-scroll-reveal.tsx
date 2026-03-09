"use client";

import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: React.ReactNode;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = content.map((_, index) =>
      cardLength === 1 ? 0 : index / (cardLength - 1),
    );

    const closestIndex = breakpoints.reduce((closest, point, index) => {
      const distance = Math.abs(latest - point);
      return distance < Math.abs(latest - breakpoints[closest]) ? index : closest;
    }, 0);

    setActiveCard(closestIndex);
  });

  return (
    <div ref={ref} className="relative bg-black">
      <div className="sticky top-20 flex min-h-[78vh] items-center md:top-24 md:min-h-[86vh]">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              key={content[activeCard].title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-xl"
            >
              {/* <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/45">
                Project {activeCard + 1}
              </p> */}
              <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {content[activeCard].title}
              </h3>
              <div className="mt-5 text-base leading-8 text-white/68 md:text-lg">
                {content[activeCard].description}
              </div>

              <div className="mt-8 flex items-center gap-2">
                {content.map((_, index) => (
                  <span
                    key={`dot-${index}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      activeCard === index ? "w-8 bg-white" : "w-2.5 bg-white/25",
                    )}
                  />
                ))}
              </div>
            </motion.div>

            <div
              className={cn(
                "mx-auto h-[300px] w-full max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_20px_70px_rgba(0,0,0,0.55)] lg:justify-self-center md:h-[420px]",
                contentClassName,
              )}
            >
              <motion.div
                key={`image-${activeCard}`}
                initial={{ opacity: 0.35, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full w-full"
              >
                {content[activeCard].content ?? null}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none">
        {content.map((item, index) => (
          <div
            key={`${item.title}-space-${index}`}
            className="h-[28vh] md:h-[34vh]"
          />
        ))}
      </div>
    </div>
  );
};
