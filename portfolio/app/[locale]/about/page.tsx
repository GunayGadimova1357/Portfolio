import {setRequestLocale} from "next-intl/server";
import {AboutHero} from "@/components/about/about-hero";

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <AboutHero />;
}
