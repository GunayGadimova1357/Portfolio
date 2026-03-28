import {ProjectsAdminClient} from "@/components/dashboard/projects/projects-admin-client";
import {getAllProjects} from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{q?: string}>;
}) {
  await params;
  const {q = ""} = await searchParams;
  const projects = await getAllProjects();

  return <ProjectsAdminClient initialProjects={projects} initialQuery={q} />;
}
