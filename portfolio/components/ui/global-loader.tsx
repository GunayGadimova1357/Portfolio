"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { EncryptedText } from "@/components/ui/encrypted-text";

const REVEAL_DELAY_MS = 78;
const FLIP_DELAY_MS = 56;

function getReadableRouteName(pathname: string): string {
  if (pathname === "/") return "Home";
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? "Page";
  return last
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function GlobalLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hideTimeoutIdRef = useRef<number | null>(null);
  const pushTimeoutIdRef = useRef<number | null>(null);
  const [loaderText, setLoaderText] = useState(() =>
    getReadableRouteName(pathname),
  );
  const [runId, setRunId] = useState(1);
  const animationKey = `${loaderText}-${runId}`;

  const playLoader = useCallback((text: string) => {
    setLoaderText(text);
    setRunId((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#")) return;
      if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return;

      const nextUrl = new URL(anchor.href, window.location.origin);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) return;

      const samePathAndSearch =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      // Let in-page anchor jumps work instantly.
      if (samePathAndSearch && nextUrl.hash !== currentUrl.hash) return;

      const destination = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      event.preventDefault();

      if (samePathAndSearch && nextUrl.hash === currentUrl.hash) {
        playLoader(getReadableRouteName(nextUrl.pathname));
        return;
      }

      if (pushTimeoutIdRef.current !== null) {
        window.clearTimeout(pushTimeoutIdRef.current);
      }

      playLoader(getReadableRouteName(nextUrl.pathname));
      router.prefetch(destination);
      pushTimeoutIdRef.current = window.setTimeout(() => {
        router.push(destination);
        pushTimeoutIdRef.current = null;
      }, 120);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => {
      if (pushTimeoutIdRef.current !== null) {
        window.clearTimeout(pushTimeoutIdRef.current);
      }
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [playLoader, router]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    const minVisibleMs = Math.max(
      520,
      loaderText.length * REVEAL_DELAY_MS + 220,
    );

    if (hideTimeoutIdRef.current !== null) {
      window.clearTimeout(hideTimeoutIdRef.current);
    }
    gsap.killTweensOf([overlay, content]);

    const startedAt = Date.now();
    gsap.set(overlay, { autoAlpha: 0, filter: "blur(0px)" });
    gsap.set(content, { opacity: 0, y: 10, scale: 0.985 });
    gsap.to(overlay, {
      autoAlpha: 1,
      duration: 0.28,
      ease: "power2.out",
    });
    gsap.to(content, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.38,
      ease: "power3.out",
      delay: 0.05,
    });

    const hideLoader = () => {
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, minVisibleMs - elapsed);
      hideTimeoutIdRef.current = window.setTimeout(() => {
        gsap.to(content, {
          opacity: 0,
          y: -6,
          scale: 0.992,
          duration: 0.3,
          ease: "power2.inOut",
        });
        gsap.to(overlay, {
          opacity: 0,
          filter: "blur(2px)",
          duration: 0.42,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(overlay, { autoAlpha: 0 });
          },
        });
      }, delay);
    };

    hideLoader();
    return () => {
      if (hideTimeoutIdRef.current !== null) {
        window.clearTimeout(hideTimeoutIdRef.current);
      }
      gsap.killTweensOf([overlay, content]);
    };
  }, [loaderText, runId]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      aria-hidden="true"
    >
      <div ref={contentRef}>
        <EncryptedText
          key={animationKey}
          text={loaderText}
          className="text-[clamp(2rem,7vw,4.5rem)] font-light tracking-[-0.04em] text-white"
          encryptedClassName="text-white/35"
          revealedClassName="text-white"
          revealDelayMs={REVEAL_DELAY_MS}
          flipDelayMs={FLIP_DELAY_MS}
        />
      </div>
    </div>
  );
}
