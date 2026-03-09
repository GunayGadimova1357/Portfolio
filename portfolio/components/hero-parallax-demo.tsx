"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "Coffee Shop",
    link: "https://github.com/GunayGadimova1357/React-Native/tree/main/coffee-shop",
    thumbnail: "/coffeegrad.pdf",
  },
  {
    title: "Phantom",
    link: "https://github.com/GunayGadimova1357/React-Native/tree/main/movie-ticket",
    thumbnail: "/moviegrad.pdf",
  },
  {
    title: "Eclipse",
    link: "https://github.com/GunayGadimova1357/React/tree/main/project",
    thumbnail: "/musicgrad.pdf",
  },
  {
    title: "Coffee Shop",
    link: "https://github.com/GunayGadimova1357/React-Native/tree/main/coffee-shop",
    thumbnail: "/coffeegrad.pdf",
  },
 
];
