import { notFound } from "next/navigation";
import { NewsArticlePage } from "./_components/NewsArticlePage";
import { NotFoundDisplay } from "./_components/NotFoundDisplay";
import { Locale } from "@/lib/types";
import { ErrorDisplay } from "./_components/ErrorDisplay";
import { PrismaClient } from "@prisma/client";

type Props = {
  params: Promise<{
    locale: Locale;
    date: string;
  }>;
};

const prisma = new PrismaClient();

export async function generateStaticParams() {
  const dataJa = await prisma.news_ja_datekey.findMany({
    select: { date: true },
    orderBy: { date: "desc" },
  });
  const dataEn = await prisma.news_en_datekey.findMany({
    select: { date: true },
    orderBy: { date: "desc" },
  });
  const dataCn = await prisma.news_cn_datekey.findMany({
    select: { date: true },
    orderBy: { date: "desc" },
  });

  const paths = dataJa
    .map(({ date }) => {
      const d = new Date(date);
      return {
        date: d.toISOString().split("T")[0],
        locale: "ja",
      };
    })
    .concat(
      dataEn.map(({ date }) => {
        const d = new Date(date);
        return {
          date: d.toISOString().split("T")[0],
          locale: "en",
        };
      })
    )
    .concat(
      dataCn.map(({ date }) => {
        const d = new Date(date);
        return {
          date: d.toISOString().split("T")[0],
          locale: "cn",
        };
      })
    );

  return paths;
}

export default async function NewsDatePage({ params }: Props) {
  const { locale, date } = await params;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date) || !["ja", "en", "cn"].includes(locale)) {
    notFound();
  }

  try {
    const targetDate = new Date(date);

    let dateRecord;
    let newsList;

    if (locale === "ja") {
      dateRecord = await prisma.news_ja_datekey.findFirst({
        where: { date: targetDate },
      });
      if (!dateRecord) return <NotFoundDisplay date={date} locale={locale} />;
      newsList = await prisma.news_ja.findMany({
        where: { datekey_id: dateRecord.id },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });
    } else if (locale === "en") {
      dateRecord = await prisma.news_en_datekey.findFirst({
        where: { date: targetDate },
      });
      if (!dateRecord) return <NotFoundDisplay date={date} locale={locale} />;
      newsList = await prisma.news_en.findMany({
        where: { datekey_id: dateRecord.id },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });
    } else {
      dateRecord = await prisma.news_cn_datekey.findFirst({
        where: { date: targetDate },
      });
      if (!dateRecord) return <NotFoundDisplay date={date} locale={locale} />;
      newsList = await prisma.news_cn.findMany({
        where: { datekey_id: dateRecord.id },
        orderBy: { id: "desc" },
        include: { news_tags: { include: { tag: true } } },
      });
    }

    const dailyNews = {
      date: targetDate.toISOString().split("T")[0],
      news: newsList,
    };

    if (dailyNews.news.length === 0) {
      return <NotFoundDisplay date={date} locale={locale} />;
    }

    return <NewsArticlePage dailyNews={dailyNews} locale={locale} />;
  } catch {
    return <ErrorDisplay date={date} locale={locale} />;
  }
}
