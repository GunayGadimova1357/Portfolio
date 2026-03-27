import {redirect} from "next/navigation";
import {getServerSession} from "next-auth/next";
import {
  CircleUserRound,
  FolderKanban,
  LayoutDashboard,
  PlusSquare,
  Search,
  Settings2,
  Sparkles,
  Zap,
  Wrench,
} from "lucide-react";
import {authOptions} from "@/auth";
import {LogoutButton} from "@/components/dashboard/logout-button";
import {SidebarNav} from "@/components/dashboard/sidebar-nav";
import {getAdminEmail} from "@/lib/admin";
import {getAllProjects} from "@/lib/projects";
import {getAllServices} from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function DashboardPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const session = await getServerSession(authOptions);

  if (session?.user?.email?.toLowerCase() !== getAdminEmail()) {
    redirect(`/${locale}/dashboard/login`);
  }

  const [projects, services] = await Promise.all([getAllProjects(), getAllServices()]);
  const publishedProjects = projects.filter((project) => project.published).length;
  const draftProjects = projects.length - publishedProjects;

  const navItems = [
    {
      href: "/dashboard/overview",
      label: "Overview",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      href: "/dashboard/create",
      label: "Create project",
      icon: <PlusSquare className="h-4 w-4" />,
    },
    {
      href: "/dashboard/projects",
      label: "Manage projects",
      icon: <FolderKanban className="h-4 w-4" />,
    },
    {
      href: "/dashboard/short-bio",
      label: "Short bio",
      icon: <CircleUserRound className="h-4 w-4" />,
    },
    {
      href: "/dashboard/technologies",
      label: "Technologies",
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      href: "/dashboard/services",
      label: "Services",
      icon: <Settings2 className="h-4 w-4" />,
    },
  ];

  return (
    <section className="min-h-screen bg-[#050505] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_28%),linear-gradient(180deg,_#0a0a0d_0%,_#050505_100%)]">
        <div className="mx-auto max-w-[1700px]">
          <div className="grid min-h-screen md:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="hidden h-screen overflow-y-auto border-r border-white/8 bg-[linear-gradient(180deg,_rgba(255,255,255,0.03)_0%,_rgba(255,255,255,0.015)_100%)] md:sticky md:top-0 md:flex md:flex-col">
              <div className="flex min-h-[93px] items-center border-b border-white/8 px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <LayoutDashboard className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">Dashboard</p>
                    <p className="text-sm text-white/40">Portfolio</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-4 py-6">
                <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-3">
                  <p className="px-3 pb-3 text-sm font-medium text-white/42">Navigation</p>
                  <SidebarNav items={navItems} />
                </div>

                <div className="mt-5 rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.015))] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/50">Workspace health</p>
                      <p className="mt-1 text-lg font-semibold text-white">Content ready</p>
                    </div>
                    <Zap className="mt-1 h-4 w-4 text-white/45" />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <CompactStat value={String(projects.length)} label="All" />
                    <CompactStat value={String(publishedProjects)} label="Live" />
                    <CompactStat value={String(draftProjects + services.length)} label="Queue" />
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-white/8 p-4">
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                      {(session.user?.name ?? "A").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {session.user?.name ?? "Admin"}
                      </p>
                      <p className="truncate text-sm text-white/45">{session.user?.email}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <LogoutButton callbackUrl={`/${locale}/dashboard/login`} />
                  </div>
                </div>
              </div>
            </aside>

            <div className="min-w-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.02)_0%,_rgba(255,255,255,0)_100%)]">
              <div className="border-b border-white/8 px-4 py-4 md:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                      <LayoutDashboard className="h-4 w-4 text-white/80" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Portfolio</p>
                      <p className="text-sm text-white/40">Dashboard</p>
                    </div>
                  </div>
                  <LogoutButton callbackUrl={`/${locale}/dashboard/login`} />
                </div>

                <div className="mt-4">
                  <SidebarNav items={navItems} mobile />
                </div>
              </div>

              <div className="sticky top-0 z-20 border-b border-white/8 bg-[#0a0b0f]/88 px-4 py-4 backdrop-blur-md md:min-h-[93px] md:px-6 lg:px-8">
                <div className="flex justify-end md:min-h-[61px] md:items-center">
                  <form
                    action={`/${locale}/dashboard/projects`}
                    className="relative w-full xl:max-w-[420px]"
                  >
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <input
                      type="search"
                      name="q"
                      placeholder="Search projects, descriptions, links..."
                      className="w-full rounded-2xl border border-white/8 bg-[#111116] py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/18"
                    />
                  </form>
                </div>
              </div>

              <div className="px-4 py-6 md:px-6 lg:px-8 xl:px-10">
                <div className="w-full space-y-6">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactStat({value, label}: {value: string; label: string}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-2 py-2.5 text-center">
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="mt-0.5 text-xs text-white/40">{label}</div>
    </div>
  );
}
