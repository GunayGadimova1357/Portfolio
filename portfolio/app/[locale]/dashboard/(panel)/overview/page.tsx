import {Link} from "@/i18n/navigation";
import {getAboutContent} from "@/lib/about";
import {getAllProjects} from "@/lib/projects";
import {getAllServices} from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [projects, about, services] = await Promise.all([
    getAllProjects(),
    getAboutContent(),
    getAllServices(),
  ]);
  const publishedProjects = projects.filter((project) => project.published);
  const latestProjects = projects.slice(0, 4);
  const draftProjects = projects.filter((project) => !project.published);

  return (
    <>
      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm text-white/55">Overview</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Workspace overview</h1>
            <p className="mt-3 text-[15px] leading-7 text-white/58">
              A practical snapshot of your portfolio content: projects, short bio, technologies
              and the next items worth updating.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <QuickLink href="/dashboard/create" label="New project" />
            <QuickLink href="/dashboard/short-bio" label="Edit short bio" />
            <QuickLink href="/dashboard/technologies" label="Manage technologies" />
            <QuickLink href="/dashboard/services" label="Services" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        <OverviewMetric
          title="All projects"
          value={String(projects.length)}
          description="Everything currently stored in portfolio data."
        />
        <OverviewMetric
          title="Published"
          value={String(publishedProjects.length)}
          description="Visible now on the public projects page."
        />
        <OverviewMetric
          title="Drafts"
          value={String(draftProjects.length)}
          description="Private items that still need review or publishing."
        />
        <OverviewMetric
          title="Technologies"
          value={String(about.technologies.length)}
          description="Items currently shown in the about stack section."
        />
        <OverviewMetric
          title="Services"
          value={String(services.length)}
          description="Dashboard-managed service records available for editing."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/55">Recent projects</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Latest ordered items</h2>
            </div>
            <Link
              href="/dashboard/projects"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition-colors hover:border-white/18 hover:text-white"
            >
              Open projects
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {latestProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/8 bg-black/20 px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{project.title}</p>
                  <p className="mt-1 truncate text-sm text-white/42">{project.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58">
                    #{project.sortOrder}
                  </span>
                  <span
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs",
                      project.published
                        ? "border-white/18 bg-black/50 text-white"
                        : "border-white/10 bg-black/30 text-white/62",
                    ].join(" ")}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
          <div>
            <p className="text-sm text-white/55">Tech stack</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Current technologies</h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {about.technologies.slice(0, 12).map((technology) => (
              <span
                key={technology.id}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/72"
              >
                {technology.name}
              </span>
            ))}
          </div>

          {about.technologies.length > 12 ? (
            <p className="mt-4 text-sm text-white/45">
              +{about.technologies.length - 12} more in Technologies
            </p>
          ) : null}
        </article>
      </section>
    </>
  );
}

function QuickLink({href, label}: {href: string; label: string}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/78 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
    >
      {label}
    </Link>
  );
}

function OverviewMetric({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-[#101015] p-5">
      <p className="text-sm text-white/45">{title}</p>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm leading-6 text-white/52">{description}</p>
    </article>
  );
}
