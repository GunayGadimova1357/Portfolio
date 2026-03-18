import {setRequestLocale} from "next-intl/server";
import {Sections} from "@/components/ui/Sections";

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <Sections />;
}
