import {
  createAboutTechnologyAction,
  deleteAboutTechnologyAction,
  updateAboutTechnologyAction,
} from "../../actions";
import {DashboardField} from "@/components/dashboard/project-form-fields";
import {getAboutContent} from "@/lib/about";

export const dynamic = "force-dynamic";

export default async function DashboardTechnologiesPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const about = await getAboutContent();

  return (
    <>
      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <p className="text-sm text-white/55">About</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Technologies</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/58">
          Manage the technology chips shown on the public about page.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm text-white/55">New item</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Add technology</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Use `iconKeys` as comma-separated simple-icons keys like `react`, `python`,
            `html5,css`. If you leave icons empty, the chip will use `fallback` text.
          </p>
        </div>

        <form action={createAboutTechnologyAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="locale" value={locale} />
          <DashboardField label="Technology ID" name="id" placeholder="typescript" />
          <DashboardField label="Name" name="name" placeholder="TypeScript" />
          <DashboardField
            label="GitHub link"
            name="href"
            placeholder="https://github.com/your-repo"
          />
          <DashboardField
            label="Sort order"
            name="sortOrder"
            type="number"
            placeholder="16"
          />
          <DashboardField
            label="Icon keys"
            name="iconKeys"
            placeholder="react or html5,css"
            required={false}
          />
          <DashboardField
            label="Fallback text"
            name="fallback"
            placeholder="TS"
            required={false}
          />
          <DashboardField
            label="Fallback color"
            name="color"
            placeholder="#3178C6"
            required={false}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Add technology
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {about.technologies.map((technology) => (
          <article
            key={technology.id}
            className="rounded-[1.8rem] border border-white/10 bg-[#101015] p-5"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{technology.name}</h3>
                <p className="mt-1 text-sm text-white/42">{technology.id}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58">
                #{technology.sortOrder}
              </span>
            </div>

            <form action={updateAboutTechnologyAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="currentId" value={technology.id} />
              <DashboardField label="Technology ID" name="id" defaultValue={technology.id} />
              <DashboardField label="Name" name="name" defaultValue={technology.name} />
              <DashboardField label="GitHub link" name="href" defaultValue={technology.href} />
              <DashboardField
                label="Sort order"
                name="sortOrder"
                type="number"
                defaultValue={String(technology.sortOrder)}
              />
              <DashboardField
                label="Icon keys"
                name="iconKeys"
                defaultValue={technology.iconKeys?.join(",")}
                placeholder="react or html5,css"
                required={false}
              />
              <DashboardField
                label="Fallback text"
                name="fallback"
                defaultValue={technology.fallback}
                placeholder="TS"
                required={false}
              />
              <DashboardField
                label="Fallback color"
                name="color"
                defaultValue={technology.color}
                placeholder="#3178C6"
                required={false}
              />

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
                >
                  Save changes
                </button>
              </div>
            </form>

            <form action={deleteAboutTechnologyAction} className="mt-3">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="technologyId" value={technology.id} />
              <button
                type="submit"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
              >
                Delete technology
              </button>
            </form>
          </article>
        ))}
      </section>
    </>
  );
}
