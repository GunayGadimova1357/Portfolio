"use client";

import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { Mesh } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FlipWords } from "@/components/ui/flip-words";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function RotatingSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[8, 0, 0]}>
      <sphereGeometry args={[15, 32, 16]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.75} />
    </mesh>
  );
}

export default function ContactPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const words = ["build", "design", "improve"];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-reveal]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        "[data-contact-sphere]",
        { autoAlpha: 0, xPercent: 10, scale: 0.95 },
        {
          autoAlpha: 1,
          xPercent: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-center overflow-hidden bg-black px-6 text-white md:px-10"
    >
      <div
        data-contact-sphere
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-full md:w-[52vw]"
      >
        <Canvas camera={{ position: [0, 0, 38], fov: 34 }}>
          <ambientLight intensity={0.35} />
          <RotatingSphere />
        </Canvas>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center md:mx-0 md:max-w-xl md:text-left">
        <p data-contact-reveal className="text-s uppercase text-white/55">
          Have a vision?
        </p>
        <h1
          data-contact-reveal
          className="mt-4 text-4xl font-light tracking-[-0.04em] md:text-6xl text-white"
        >
          Let&apos;s
          <FlipWords
            words={words}
            className="px-3 text-white dark:text-white"
          />
          it together.
        </h1>
        <p
          data-contact-reveal
          className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 md:text-lg"
        >
          Open to product and full-stack collaboration. Reach out and I will get
          back to you shortly.
        </p>

        <div
          data-contact-reveal
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:items-start md:justify-start"
        >
          <a
            href="mailto:gadimovagunay87@gmail.com"
            className="rounded-full border border-white/35 px-8 py-4 text-sm transition-colors duration-300 hover:bg-white hover:text-black"
          >
            gadimovagunay87@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/gadimovagunay/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/35 px-8 py-4 text-sm transition-colors duration-300 hover:bg-white hover:text-black"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
