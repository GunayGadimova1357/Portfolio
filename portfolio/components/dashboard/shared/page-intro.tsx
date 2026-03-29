export function DashboardPageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrow ? <p className="text-sm text-white/55">{eyebrow}</p> : null}
          <h1 className="mt-2 text-4xl font-semibold text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/58">{description}</p>
        </div>
        {action}
      </div>
    </section>
  );
}
