"use client";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Phantom",
    description:
      "Movie discovery web app with modern UI, dynamic search, and responsive layouts optimized for smooth browsing.",
    content: (
      <div className="relative h-full w-full">
        <Image
          src="/movieapp.png"
          alt="Phantom project preview"
          fill
          className="object-cover object-center"
        />
      </div>
    ),
  },
  {
    title: "Eclipse",
    description:
    <span>
      Interactive music streaming app, developed with{" "}
      <a 
        href="https://github.com/F4IK05" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-zinc-100 hover:text-white transition-colors"
      >
        @F4IK05
      </a>.
    </span>,
    content: (
      <div className="relative h-full w-full">
        <Image
          src="/musicapp.png"
          alt="Eclipse project preview"
          fill
          className="object-cover object-center"
        />
      </div>
    ),
  },
  {
    title: "Coffee Shop",
    description:
      "Product-style coffee app concept focused on clean visual hierarchy, clear navigation, and mobile-first usability.",
    content: (
      <div className="relative h-full w-full">
        <Image
          src="/coffeeapp.png"
          alt="Coffee Shop project preview"
          fill
          className="object-cover object-center"
        />
      </div>
    ),
  },
  {
    title: "Maze Game",
    description:
      "Game with immersive environments, intuitive controls, and dynamic challenges for engaging gameplay.",
    content: (
      <div className="relative h-full w-full">
        <Image
          src="/maze.png"
          alt="Maze Game project preview"
          fill
          className="object-cover object-center"
        />
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
