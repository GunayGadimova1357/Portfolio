"use client";
import {useTranslations} from "next-intl";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  const t = useTranslations("projects");
  const products = [
    {
      title: "Coffee Shop",
      link: "https://github.com/GunayGadimova1357/React-Native/tree/main/coffee-shop",
      thumbnail: "/coffeegrad.jpg",
      alt: t("items.coffeeShop.alt"),
    },
    {
      title: "Phantom",
      link: "https://github.com/GunayGadimova1357/React-Native/tree/main/movie-ticket",
      thumbnail: "/moviegrad.jpg",
      alt: t("items.phantom.alt"),
    },
    {
      title: "Eclipse",
      link: "https://github.com/GunayGadimova1357/React/tree/main/project",
      thumbnail: "/musicgrad.jpg",
      alt: t("items.eclipse.alt"),
    },
    {
      title: "Coffee Shop",
      link: "https://github.com/GunayGadimova1357/React-Native/tree/main/coffee-shop",
      thumbnail: "/coffeegrad.jpg",
      alt: t("items.coffeeShop.alt"),
    },
  ];

  return <HeroParallax products={products} />;
}
