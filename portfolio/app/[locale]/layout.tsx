import {NextIntlClientProvider, hasLocale} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {ConditionalFooter} from "@/components/layout/conditional-footer";
import {GlobalLoader} from "@/components/ui/global-loader";
import {routing} from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <GlobalLoader />
      <Navbar />
      <div className="relative z-10">
        <main>{children}</main>
        <ConditionalFooter>
          <Footer />
        </ConditionalFooter>
      </div>
    </NextIntlClientProvider>
  );
}
