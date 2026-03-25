import {setRequestLocale} from "next-intl/server";
import {useTranslations} from "next-intl";
import HeroParallaxDemo from "@/components/hero-parallax-demo";
import {ProjectsGrid} from "@/components/projects/projects-grid";
import {getPublishedProjects} from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const projects = await getPublishedProjects();

  return <ProjectsContent projects={projects} />;
}

function ProjectsContent({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>;
}) {
  const t = useTranslations("projects");

  return (
    <section className="bg-black text-white">
      <HeroParallaxDemo projects={projects} />
      {projects.length > 0 ? (
        <ProjectsGrid projects={projects} />
      ) : (
        <div className="mx-auto -mt-20 flex w-full max-w-6xl items-center justify-center gap-3 px-8 pb-24 pt-6 text-center md:-mt-24 md:px-16">
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white/85"
          />
          <p className="text-sm text-white/58">
            {t("loadingSoon")}
          </p>
        </div>
      )}
    </section>
  );
}
