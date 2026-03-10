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
    thumbnail: "/coffeegrad.jpg",
  },
  {
    title: "Phantom",
    link: "https://github.com/GunayGadimova1357/React-Native/tree/main/movie-ticket",
    thumbnail: "/moviegrad.jpg",
  },
  {
    title: "Eclipse",
    link: "https://github.com/GunayGadimova1357/React/tree/main/project",
    thumbnail: "/musicgrad.jpg",
  },
  {
    title: "Coffee Shop",
    link: "https://github.com/GunayGadimova1357/React-Native/tree/main/coffee-shop",
    thumbnail: "/coffeegrad.jpg",
  },
 
];
