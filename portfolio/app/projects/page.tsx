import HeroParallaxDemo from "@/components/hero-parallax-demo";

export default function ProjectsPage() {
  return (
    <section className="bg-black text-white">
      <HeroParallaxDemo />
      <div className="mx-auto -mt-20 flex w-full max-w-6xl items-center justify-center gap-3 px-8 pb-24 pt-6 text-center md:-mt-24 md:px-16">
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white/85"
        />
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">
          More projects loading soon
        </p>
      </div>
    </section>
  );
}
