import {setRequestLocale} from "next-intl/server";
import {AboutHero} from "@/components/about/about-hero";
import {getAboutContent} from "@/lib/about";

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const about = await getAboutContent();

  return <AboutHero about={about} />;
}
