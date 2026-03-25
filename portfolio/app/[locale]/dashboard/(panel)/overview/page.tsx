import {getAllProjects} from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const projects = await getAllProjects();
  const publishedProjects = projects.filter((project) => project.published).length;

  return (
    <>
      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-sm text-white/55">Overview</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Dashboard</h1>
          <p className="mt-2 text-lg text-white/72">A clean view of your portfolio workspace.</p>
          <p className="mt-4 text-[15px] leading-7 text-white/58">
            Use the sidebar to move between sections, create new entries, and update what appears
            on the public projects page.
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
          <p className="text-sm text-white/55">Workspace status</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Manage your portfolio projects in one place
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/58">
            The dashboard is focused on projects only. Published entries appear on the public site,
            while drafts stay private until you enable them.
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
          <p className="text-sm text-white/55">Quick numbers</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <OverviewMetric title="Projects" value={String(projects.length)} />
            <OverviewMetric title="Published" value={String(publishedProjects)} />
            <OverviewMetric title="Drafts" value={String(projects.length - publishedProjects)} />
          </div>
        </article>
      </section>

      {/* <section className="grid gap-5 md:grid-cols-3">
        <OverviewCard
          title="Create new entry"
          description="Add a new project card with title, description, image path and external link."
        />
        <OverviewCard
          title="Edit existing projects"
          description="Update content, reorder cards and switch any project between draft and published."
        />
        <OverviewCard
          title="Keep the public page clean"
          description="Only published projects appear on the public portfolio, so drafts stay safely hidden."
        />
      </section> */}
    </>
  );
}

function OverviewCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-[#101015] p-6">
      <p className="text-sm text-white/55">{title}</p>
      <p className="mt-3 text-sm leading-6 text-white/58">{description}</p>
    </article>
  );
}

function OverviewMetric({title, value}: {title: string; value: string}) {
  return (
    <div className="rounded-[1.25rem] border border-white/8 bg-black/25 px-4 py-4">
      <p className="text-sm text-white/45">{title}</p>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}
