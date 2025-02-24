import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import Sidebar from "@/components/sideBar";
import { Header } from "@/components/header";
import {
  notoSans,
  notoSansJP,
  notoSansSC,
  notoSerif,
  notoSerifJP,
  notoSerifSC,
} from "@/lib/font";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL_PRD;
  const pageUrl = `${siteUrl}/${locale}`;
  const title = t("newsListTitle");
  const description = t("newsListDescription");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en`,
        ja: `${siteUrl}/ja`,
        zh: `${siteUrl}/cn`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "AI News",
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  const messages = await getMessages({ locale });

  const fontClasses = `${notoSans.className} ${notoSansJP.className} ${notoSansSC.className} ${notoSerif.className} ${notoSerifJP.className} ${notoSerifSC.className}`;

  const localeFontClass =
    locale === "ja" ? "font-ja" : locale === "cn" ? "font-cn" : "font-en";

  return (
    <html lang={locale} className={fontClasses}>
      <body className={localeFontClass}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <div className="flex pt-16 min-h-screen">
            <Sidebar whatFor="pc" />
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
