"use client";

import React, {useState} from "react";
import {motion} from "framer-motion";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navItems = [
    {name: t("projects"), href: "/projects"},
    {name: t("about"), href: "/about"},
    {name: t("contact"), href: "/contact"},
  ] as const;

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-10 py-8 z-50 bg-[var(--chrome-surface)]/90 backdrop-blur-md border-b border-white/10">
      <Link href="/" className="text-white text-xl font-medium tracking-tight">
        {t("home")}
      </Link>

      <div className="flex items-center gap-4">
        <ul
          className="flex items-center gap-1"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navItems.map((item, index) => (
            <li key={item.name} className="relative">
              <Link
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                className="relative z-10 px-5 py-2 text-[15px] text-white/70 transition-colors duration-300 hover:text-white"
              >
                {item.name}
              </Link>

              {hoveredIndex === index && (
                <motion.div
                  layoutId="nav-hover-bg"
                  className="absolute inset-0 -z-0 rounded-full bg-white/10"
                  transition={{type: "spring", stiffness: 350, damping: 30}}
                />
              )}
            </li>
          ))}
        </ul>

        <div
          aria-label={t("languageLabel")}
          className="flex items-center rounded-full border border-white/10 bg-white/5 p-1"
        >
          {routing.locales.map((nextLocale) => {
            const isActive = locale === nextLocale;

            return (
              <button
                key={nextLocale}
                type="button"
                onClick={() => router.replace(pathname, {locale: nextLocale})}
                className={[
                  "rounded-full px-3 py-1.5 text-xs tracking-[0.2em] transition-colors duration-300",
                  isActive
                    ? "bg-white text-black"
                    : "text-white/65 hover:text-white",
                ].join(" ")}
              >
                {t(nextLocale)}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
