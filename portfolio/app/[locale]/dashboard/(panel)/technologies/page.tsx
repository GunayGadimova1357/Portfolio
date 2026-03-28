import {TechnologiesAdminClient} from "@/components/dashboard/about/technologies-admin-client";
import {getAboutContent} from "@/lib/about";

export const dynamic = "force-dynamic";

export default async function DashboardTechnologiesPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  await params;
  const about = await getAboutContent();

  return <TechnologiesAdminClient initialTechnologies={about.technologies} />;
}
