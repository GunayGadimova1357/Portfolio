import {AboutBioAdminClient} from "@/components/dashboard/about/about-bio-admin-client";
import {getAboutContent} from "@/lib/about";

export const dynamic = "force-dynamic";

export default async function DashboardShortBioPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  await params;
  const about = await getAboutContent();

  return <AboutBioAdminClient initialBio={about.bio} />;
}
