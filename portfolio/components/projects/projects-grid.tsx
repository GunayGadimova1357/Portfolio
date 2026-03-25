import type {ProjectRecord} from "@/lib/projects";

export function ProjectsGrid({projects}: {projects: ProjectRecord[]}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-8 pb-24 md:grid-cols-2 md:px-16 xl:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] transition-transform duration-300 hover:-translate-y-1"
        >
          <div
            className="h-52 bg-cover bg-center"
            style={{backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url(${project.thumbnail})`}}
          />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">
                {project.title}
              </h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
                #{project.sortOrder}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/62">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full border border-white/14 px-4 py-2 text-sm text-white/78 transition-colors hover:border-white/28 hover:text-white"
            >
              Open project
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
