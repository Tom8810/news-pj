import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { getNewsByDate } from "@/lib/frontQuery";
import { Locale } from "@/lib/types";
import { formatLocaleDate } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
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

  // ニュースデータを取得
  const dailyNews = await getNewsByDate(new Date(date), locale);
  const heading1 = dailyNews?.news?.[0]?.title ?? "";
  const titles = dailyNews.news.map((news) => news.title);
  const descriptionStr =
    locale === "en"
      ? `\"${titles.join('", "')}\"`
      : `「${titles.join("」「")}」`;

  const formattedDate = formatLocaleDate(new Date(date), locale);

  const siteUrl = "https://example.com"; // ここを実際のサイトURLに変更
  const pageUrl = `${siteUrl}/${locale}/news/${date}`;

  // SEO最適化した title & description
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
