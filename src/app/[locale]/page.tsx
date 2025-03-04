import { getTranslations } from "next-intl/server";
import { Locale, DailyNews } from "../../lib/types";
import NewsList from "./_components/NewsList";
import { NewsContentFooter } from "@/components/newsContentFooter";
import { PrismaClient } from "@prisma/client";
import Pagination from "./_components/Pagination";
import { cn, sansLocaledClassName } from "@/lib/utils";

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

const prisma = new PrismaClient();

async function fetchNews(locale: Locale) {
  let totalDays: number;
  let paginatedDates: { date: Date; id: number }[];
  const groupedNews: DailyNews[] = [];

  if (locale === "ja") {
    // 該当するニュースの日数を取得
    totalDays = await prisma.news_ja
      .groupBy({
        by: ["datekey_id"],
        _count: true,
      })
      .then((res) => res.length); // ヒットした日数を取得

    // ヒットした日付のリストを取得（ページネーション適用）
    paginatedDates = await prisma.news_ja_datekey.findMany({
      where: {
        id: {
          in: await prisma.news_ja
            .findMany({
              select: { datekey_id: true },
              distinct: ["datekey_id"],
              orderBy: { datekey_id: "desc" },
              take: 10,
            })
            .then((res) => res.map((r) => r.datekey_id)),
        },
      },
      orderBy: { date: "desc" },
    });

    for (const dateRecord of paginatedDates) {
      const newsForDate = await prisma.news_ja.findMany({
        where: {
          datekey_id: dateRecord.id,
        },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });

      if (newsForDate.length > 0) {
        groupedNews.push({
          date: dateRecord.date.toISOString().split("T")[0],
          news: newsForDate,
        });
      }
    }
  } else if (locale === "en") {
    totalDays = await prisma.news_en
      .groupBy({
        by: ["datekey_id"],
        _count: true,
      })
      .then((res) => res.length);

    paginatedDates = await prisma.news_en_datekey.findMany({
      where: {
        id: {
          in: await prisma.news_en
            .findMany({
              select: { datekey_id: true },
              distinct: ["datekey_id"],
              orderBy: { datekey_id: "desc" },
              take: 10,
            })
            .then((res) => res.map((r) => r.datekey_id)),
        },
      },
      orderBy: { date: "desc" },
    });

    for (const dateRecord of paginatedDates) {
      const newsForDate = await prisma.news_en.findMany({
        where: {
          datekey_id: dateRecord.id,
        },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });

      if (newsForDate.length > 0) {
        groupedNews.push({
          date: dateRecord.date.toISOString().split("T")[0],
          news: newsForDate,
        });
      }
    }
  } else {
    totalDays = await prisma.news_cn
      .groupBy({
        by: ["datekey_id"],
        _count: true,
      })
      .then((res) => res.length);

    paginatedDates = await prisma.news_cn_datekey.findMany({
      where: {
        id: {
          in: await prisma.news_cn
            .findMany({
              select: { datekey_id: true },
              distinct: ["datekey_id"],
              orderBy: { datekey_id: "desc" },
              take: 10,
            })
            .then((res) => res.map((r) => r.datekey_id)),
        },
      },
      orderBy: { date: "desc" },
    });

    for (const dateRecord of paginatedDates) {
      const newsForDate = await prisma.news_cn.findMany({
        where: {
          datekey_id: dateRecord.id,
        },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });

      if (newsForDate.length > 0) {
        groupedNews.push({
          date: dateRecord.date.toISOString().split("T")[0],
          news: newsForDate,
        });
      }
    }
  }

  return {
    news: groupedNews,
    total: totalDays,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(totalDays / 10),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "list" });
  const news = await fetchNews(locale);

  return (
    <div className="bg-white h-full w-full ">
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
        </div>
        <NewsList news={news.news} isLoading={false} error={null} />

        {/* ページネーションが必要な場合にのみ表示 */}
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
