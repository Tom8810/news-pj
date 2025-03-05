import { getTranslations } from "next-intl/server";
import { Locale, DailyNews } from "../../lib/types";
import NewsList from "./_components/NewsList";
import { NewsContentFooter } from "@/components/newsContentFooter";
import { PrismaClient } from "@prisma/client";
import Pagination from "./_components/Pagination";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { SearchBox } from "@/components/searchBox";

const prisma = new PrismaClient();

async function fetchNews(locale: Locale) {
  let totalDays: number;
  let paginatedDates: { date: Date; id: number }[];
  const groupedNews: DailyNews[] = [];

  if (locale === "ja") {
    totalDays = await prisma.news_ja
      .groupBy({ by: ["datekey_id"], _count: true })
      .then((res) => res.length);
    paginatedDates = await prisma.news_ja_datekey.findMany({
      where: {
        id: {
          in: await prisma.news_ja
            .findMany({
              select: { datekey_id: true },
              distinct: ["datekey_id"],
              orderBy: { datekey_id: "desc" },
              take: 5,
            })
            .then((res) => res.map((r) => r.datekey_id)),
        },
      },
      orderBy: { date: "desc" },
    });
  } else if (locale === "en") {
    totalDays = await prisma.news_en
      .groupBy({ by: ["datekey_id"], _count: true })
      .then((res) => res.length);
    paginatedDates = await prisma.news_en_datekey.findMany({
      where: {
        id: {
          in: await prisma.news_en
            .findMany({
              select: { datekey_id: true },
              distinct: ["datekey_id"],
              orderBy: { datekey_id: "desc" },
              take: 5,
            })
            .then((res) => res.map((r) => r.datekey_id)),
        },
      },
      orderBy: { date: "desc" },
    });
  } else {
    totalDays = await prisma.news_cn
      .groupBy({ by: ["datekey_id"], _count: true })
      .then((res) => res.length);
    paginatedDates = await prisma.news_cn_datekey.findMany({
      where: {
        id: {
          in: await prisma.news_cn
            .findMany({
              select: { datekey_id: true },
              distinct: ["datekey_id"],
              orderBy: { datekey_id: "desc" },
              take: 5,
            })
            .then((res) => res.map((r) => r.datekey_id)),
        },
      },
      orderBy: { date: "desc" },
    });
  }

  for (const dateRecord of paginatedDates) {
    let newsForDate;
    if (locale === "ja") {
      newsForDate = await prisma.news_ja.findMany({
        where: { datekey_id: dateRecord.id },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });
    } else if (locale === "en") {
      newsForDate = await prisma.news_en.findMany({
        where: { datekey_id: dateRecord.id },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });
    } else {
      newsForDate = await prisma.news_cn.findMany({
        where: { datekey_id: dateRecord.id },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });
    }

    if (newsForDate.length > 0) {
      groupedNews.push({
        date: dateRecord.date.toISOString().split("T")[0],
        news: newsForDate,
      });
    }
  }

  return {
    news: groupedNews,
    total: totalDays,
    page: 1,
    limit: 5,
    totalPages: Math.ceil(totalDays / 5),
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "en" }, { locale: "cn" }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "list" });
  const news = await fetchNews(locale);

  return (
    <div className="bg-white h-full w-full">
      <div className="bg-white h-full w-full p-6">
        <div className="flex justify-between items-center mb-6 gap-8 px-6 flex-col lg:flex-row">
          <h1
            className={cn(
              "text-3xl font-semibold text-gray-800 whitespace-nowrap",
              sansLocaledClassName(locale)
            )}
          >
            {t("title")}
          </h1>
          <SearchBox isStatic={true} />
        </div>
        <NewsList news={news.news} isLoading={false} error={null} />
        {news.totalPages > 1 && (
          <Pagination
            currentPage={1}
            totalPages={news.totalPages}
            isStaticList={true}
          />
        )}
      </div>
      <NewsContentFooter />
    </div>
  );
}
