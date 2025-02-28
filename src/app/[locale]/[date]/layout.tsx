import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { DailyNews, Locale } from "@/lib/types";
import { formatLocaleDate } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white">{children}</div>;
}

type Props = {
  params: Promise<{
    date: string;
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date, locale } = await params;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "meta" });

  const dailyNews = await getDailyNews(new Date(date), locale);
  if (!dailyNews) {
    return {};
  }
  const heading1 =
    dailyNews?.news?.[0]?.title.replace(/\*\*(.*?)\*\*/g, "$1") ?? "";
  const titles = dailyNews.news.map((news) =>
    news.title.replace(/\*\*(.*?)\*\*/g, "$1")
  );
  const descriptionStr =
    locale === "en"
      ? `\"${titles.join('", "')}\"`
      : `「${titles.join("」「")}」`;

  const formattedDate = formatLocaleDate(new Date(date), locale);

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL_PRD;
  const pageUrl = `${siteUrl}/${locale}/news/${date}`;

  const title =
    t("newsPageTitle", {
      formattedDate,
      heading1,
    }) ||
    `【解説付き最新AIニュース】${formattedDate}の重要トピック: 「${heading1}」ほか`;

  const description =
    t("newsPageDescription", {
      formattedDate,
      descriptionStr,
    }) ||
    `${formattedDate}のAIニュース: ${descriptionStr}。専門用語には解説付きで、最新のAI動向を分かりやすくお届け。`;

  // JSON-LD構造化データ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Organization",
      name: "AI News",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en/${date}`,
        ja: `${siteUrl}/ja/${date}`,
        zh: `${siteUrl}/cn/${date}`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "AI News",
      type: "article",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}

const getDailyNews = async (
  date: Date,
  locale: Locale
): Promise<DailyNews | undefined> => {
  const targetDate = new Date(date);

  let dateRecord;
  let newsList;

  if (locale === "ja") {
    dateRecord = await prisma.news_ja_datekey.findFirst({
      where: { date: targetDate },
    });
    if (!dateRecord) return undefined;
    newsList = await prisma.news_ja.findMany({
      where: { datekey_id: dateRecord.id },
      orderBy: { id: "desc" },
      include: { news_tags: { include: { tag: true } } },
    });
  } else if (locale === "en") {
    dateRecord = await prisma.news_en_datekey.findFirst({
      where: { date: targetDate },
    });
    if (!dateRecord) return undefined;
    newsList = await prisma.news_en.findMany({
      where: { datekey_id: dateRecord.id },
      orderBy: { id: "desc" },
      include: { news_tags: { include: { tag: true } } },
    });
  } else {
    dateRecord = await prisma.news_cn_datekey.findFirst({
      where: { date: targetDate },
    });
    if (!dateRecord) return undefined;
    newsList = await prisma.news_cn.findMany({
      where: { datekey_id: dateRecord.id },
      orderBy: { id: "desc" },
      include: { news_tags: { include: { tag: true } } },
    });
  }

  return {
    date: targetDate.toISOString().split("T")[0],
    news: newsList,
  };
};
