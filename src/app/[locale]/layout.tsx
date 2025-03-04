import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import {
  notoSans,
  notoSansJP,
  notoSansSC,
  notoSerif,
  notoSerifJP,
  notoSerifSC,
} from "@/lib/font";
import { Locale } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { sansLocaledClassName } from "@/lib/utils";
import { Header } from "@/components/header";
import Sidebar from "@/components/sideBar/sideBar";

const prisma = new PrismaClient();

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

export const generateStaticParams = async () => {
  return [{ locale: "ja" }, { locale: "en" }, { locale: "cn" }];
};

export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: Locale }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const fontClasses = `${notoSans.className} ${notoSansJP.className} ${notoSansSC.className} ${notoSerif.className} ${notoSerifJP.className} ${notoSerifSC.className}`;
  const localeFontClass =
    locale === "ja" ? "font-ja" : locale === "cn" ? "font-cn" : "font-en";
  const localeClass = sansLocaledClassName(locale);

  const newsDates: Record<number, Record<number, number[]>> = {};
  let allDates;
  if (locale === "ja") {
    allDates = await prisma.news_ja_datekey.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
    });
  } else if (locale === "en") {
    allDates = await prisma.news_en_datekey.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
    });
  } else {
    allDates = await prisma.news_cn_datekey.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
    });
  }

  allDates.forEach(({ date }) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    if (!newsDates[year]) newsDates[year] = {};
    if (!newsDates[year][month]) newsDates[year][month] = [];

    newsDates[year][month].push(day);
  });

  await prisma.$disconnect();

  return (
    <html lang={locale} className={fontClasses}>
      <body className={localeFontClass}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header newsDates={newsDates} localeClass={localeClass} />
          <div className="flex pt-16 min-h-screen">
            <Sidebar
              whatFor="pc"
              localeClass={localeClass}
              newsDates={newsDates}
            />
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
