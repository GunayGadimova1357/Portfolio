import {redirect} from "next/navigation";
import Scene from "@/components/ui/Scene";
import {LoginForm} from "@/components/dashboard/login-form";
import {isAdminSession} from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLoginPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (await isAdminSession()) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(222,184,135,0.14),_transparent_28%),linear-gradient(180deg,_#111111_0%,_#050505_100%)] px-6 py-20 text-white">
      <Scene className="absolute inset-0 opacity-60" starOpacity={0.25} />
      <div className="relative mx-auto max-w-md">
        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <p className="text-sm text-white/55">Dashboard access</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Private admin panel
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-white/62">
            Only the configured admin account can enter this area.
          </p>

          <div className="mt-8">
            <LoginForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
