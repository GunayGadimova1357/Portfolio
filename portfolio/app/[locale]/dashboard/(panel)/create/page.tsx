import {createProjectAction} from "../../actions";
import {DashboardCheckbox, DashboardField} from "@/components/dashboard/project-form-fields";

export default async function DashboardCreatePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
      <div className="mb-6">
        <p className="text-sm text-white/55">Projects</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Create a new project</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/58">
          Add a new card for the public portfolio. You can keep it as a draft first or publish it
          immediately.
        </p>
      </div>

      <form action={createProjectAction}>
        <input type="hidden" name="locale" value={locale} />
        <div className="grid gap-4 md:grid-cols-2">
          <DashboardField label="Project ID" name="id" placeholder="cinema-app" />
          <DashboardField label="Title" name="title" placeholder="Cinema App" />
          <div className="md:col-span-2">
            <DashboardField
              label="Description"
              name="description"
              placeholder="Short project summary"
              multiline
            />
          </div>
          <DashboardField label="Project link" name="link" placeholder="https://github.com/..." />
          <DashboardField
            label="Thumbnail path"
            name="thumbnail"
            placeholder="/moviegrad.jpg"
          />
          <DashboardField label="Image alt text" name="alt" placeholder="Project preview" />
          <DashboardField label="Display order" name="sortOrder" placeholder="5" type="number" />
          <div className="md:col-span-2">
            <DashboardCheckbox label="Publish immediately" name="published" defaultChecked />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Create project
        </button>
      </form>
    </section>
  );
}
