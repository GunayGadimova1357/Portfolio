"use client";

import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Check, ChevronDown} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const localeMenuRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  const navItems = [
    {name: t("projects"), href: "/projects"},
    {name: t("about"), href: "/about"},
    {name: t("contact"), href: "/contact"},
  ] as const;
  const localeLabels = {
    en: "English",
    ru: "Русский",
    az: "Azərbaycan",
  } as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!localeMenuRef.current?.contains(target)) {
        setIsLocaleMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-10 py-8 z-50 bg-[var(--chrome-surface)]/90 backdrop-blur-md border-b border-white/10">
      <Link href="/" className="text-white text-xl font-medium tracking-tight">
        {t("home")}
      </Link>

      <div className="flex items-center gap-3">
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

        <div ref={localeMenuRef} className="relative">
          <button
            type="button"
            aria-label={t("languageLabel")}
            aria-expanded={isLocaleMenuOpen}
            onClick={() => setIsLocaleMenuOpen((current) => !current)}
            className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.045] px-3 py-2 text-[10px] font-medium tracking-[0.24em] text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 hover:border-white/16 hover:bg-white/[0.07] hover:text-white"
          >
            <span>{t(locale)}</span>
            <ChevronDown
              className={[
                "h-3.5 w-3.5 transition-transform duration-200",
                isLocaleMenuOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {isLocaleMenuOpen ? (
            <div className="absolute right-0 top-full mt-2 min-w-40 overflow-hidden rounded-2xl border border-white/10 bg-black/92 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              {routing.locales.map((nextLocale) => {
                const isActive = locale === nextLocale;

                return (
                  <button
                    key={nextLocale}
                    type="button"
                    onClick={() => {
                      setIsLocaleMenuOpen(false);
                      if (!isActive) {
                        router.replace(pathname, {locale: nextLocale});
                      }
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-[1rem] px-3 py-2 text-left transition-colors duration-200",
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-white/62 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-medium tracking-[0.24em]">
                        {t(nextLocale)}
                      </span>
                      <span className="text-xs tracking-normal text-white/48">
                        {localeLabels[nextLocale]}
                      </span>
                    </span>
                    <Check
                      className={[
                        "h-3.5 w-3.5 transition-opacity duration-200",
                        isActive ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
