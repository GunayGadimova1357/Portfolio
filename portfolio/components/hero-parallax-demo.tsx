"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import type {ProjectRecord} from "@/lib/projects";

export default function HeroParallaxDemo({projects}: {projects: ProjectRecord[]}) {
  return (
    <HeroParallax
      products={projects.map((project) => ({
        title: project.title,
        link: project.link,
        thumbnail: project.thumbnail,
        alt: project.alt,
      }))}
    />
  );
}
