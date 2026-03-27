import {updateAboutBioAction} from "../../actions";
import {DashboardField} from "@/components/dashboard/project-form-fields";
import {getAboutContent} from "@/lib/about";

export const dynamic = "force-dynamic";

export default async function DashboardShortBioPage({
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
        <h1 className="mt-2 text-4xl font-semibold text-white">Short bio</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/58">
          Edit the short bio text used on the public about page for each locale.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <form action={updateAboutBioAction} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <DashboardField
            label="English bio"
            name="bio_en"
            defaultValue={about.bio.en}
            multiline
            rows={5}
          />
          <DashboardField
            label="Russian bio"
            name="bio_ru"
            defaultValue={about.bio.ru}
            multiline
            rows={5}
          />
          <DashboardField
            label="Azerbaijani bio"
            name="bio_az"
            defaultValue={about.bio.az}
            multiline
            rows={5}
          />

          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Save bio
          </button>
        </form>
      </section>
    </>
  );
}
