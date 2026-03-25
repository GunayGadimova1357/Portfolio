import {deleteProjectAction, updateProjectAction} from "../../actions";
import {Link} from "@/i18n/navigation";
import {DashboardCheckbox, DashboardField} from "@/components/dashboard/project-form-fields";
import {getAllProjects} from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{q?: string}>;
}) {
  const {locale} = await params;
  const {q = ""} = await searchParams;
  const query = q.trim().toLowerCase();
  const projects = (await getAllProjects()).filter((project) => {
    if (!query) {
      return true;
    }

    const haystack = [project.title, project.description, project.id, project.link]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  return (
    <>
      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-white/55">Projects</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Projects</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/58">
              Manage your portfolio projects and case studies from one place.
            </p>
          </div>

          <Link
            href="/dashboard/create"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            New project
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form action={`/${locale}/dashboard/projects`} className="w-full max-w-xl">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search projects..."
              className="w-full rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/18"
            />
          </form>

          <div className="flex items-center gap-3 text-sm text-white/45">
            <span className="rounded-full border border-white/10 px-3 py-2">
              {projects.length} result{projects.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </section>

      {projects.length > 0 ? (
        <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#101015]"
            >
              <div
                className="relative h-52 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0.55)), url(${project.thumbnail})`,
                }}
              >
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <span
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs",
                      project.published
                        ? "border-white/18 bg-black/55 text-white"
                        : "border-white/10 bg-black/45 text-white/65",
                    ].join(" ")}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                  <span className="rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-xs text-white/65">
                    #{project.sortOrder}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
                  <p className="mt-2 text-sm text-white/42">{project.id}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/58">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/8 bg-black/25 px-3 py-1.5 text-xs text-white/58">
                    Link set
                  </span>
                  <span className="rounded-full border border-white/8 bg-black/25 px-3 py-1.5 text-xs text-white/58">
                    Image ready
                  </span>
                </div>

                <details className="mt-5 rounded-[1.4rem] border border-white/8 bg-black/25 p-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-white">
                    Edit project
                  </summary>

                  <form action={updateProjectAction} className="mt-4 grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="currentId" value={project.id} />
                    <DashboardField label="Project ID" name="id" defaultValue={project.id} />
                    <DashboardField label="Title" name="title" defaultValue={project.title} />
                    <div className="md:col-span-2">
                      <DashboardField
                        label="Description"
                        name="description"
                        defaultValue={project.description}
                        multiline
                      />
                    </div>
                    <DashboardField label="Project link" name="link" defaultValue={project.link} />
                    <DashboardField
                      label="Thumbnail path"
                      name="thumbnail"
                      defaultValue={project.thumbnail}
                    />
                    <DashboardField label="Image alt text" name="alt" defaultValue={project.alt} />
                    <DashboardField
                      label="Display order"
                      name="sortOrder"
                      defaultValue={String(project.sortOrder)}
                      type="number"
                    />
                    <div className="md:col-span-2">
                      <DashboardCheckbox
                        label="Published"
                        name="published"
                        defaultChecked={project.published}
                      />
                    </div>

                    <div className="mt-2 md:col-span-2">
                      <button
                        type="submit"
                        className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
                      >
                        Save changes
                      </button>
                    </div>
                  </form>
                </details>

                <form action={deleteProjectAction} className="mt-3">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
                  >
                    Delete project
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">No projects found</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Try another search or create a new project from the dashboard.
          </p>
        </section>
      )}
    </>
  );
}
