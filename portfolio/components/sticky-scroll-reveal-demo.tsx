"use client";
import Image from "next/image";
import {useTranslations} from "next-intl";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

export default function StickyScrollRevealDemo() {
  const t = useTranslations("projects");
  const content = [
    {
      title: "Phantom",
      description: t("items.phantom.description"),
      content: (
        <div className="relative h-full w-full">
          <Image
            src="/movieapp.png"
            alt={t("items.phantom.alt")}
            fill
            className="object-cover object-center"
          />
        </div>
      ),
    },
    {
      title: "Eclipse",
      description: (
        <span>
          {t("items.eclipse.descriptionBefore")}
          <a
            href="https://github.com/F4IK05"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 transition-colors hover:text-white"
          >
            @F4IK05
          </a>
          {t("items.eclipse.descriptionAfter")}
        </span>
      ),
      content: (
        <div className="relative h-full w-full">
          <Image
            src="/musicapp.png"
            alt={t("items.eclipse.alt")}
            fill
            className="object-cover object-center"
          />
        </div>
      ),
    },
    {
      title: "Coffee Shop",
      description: t("items.coffeeShop.description"),
      content: (
        <div className="relative h-full w-full">
          <Image
            src="/coffeeapp.png"
            alt={t("items.coffeeShop.alt")}
            fill
            className="object-cover object-center"
          />
        </div>
      ),
    },
    {
      title: "Maze Game",
      description: t("items.mazeGame.description"),
      content: (
        <div className="relative h-full w-full">
          <Image
            src="/maze.png"
            alt={t("items.mazeGame.alt")}
            fill
            className="object-cover object-center"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
