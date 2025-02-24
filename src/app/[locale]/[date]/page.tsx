import { notFound } from "next/navigation";
import { NewsArticlePage } from "./_components/NewsArticlePage";
import { getNewsByDate } from "@/lib/frontQuery";
import { NotFoundDisplay } from "./_components/NotFoundDisplay";
import { ErrorDisplay } from "./_components/ErrorDisplay";

import { Locale } from "@/lib/types";

type Props = {
  params: Promise<{
    date: string;
    locale: Locale;
  }>;
};

export default async function NewsDatePage({ params }: Props) {
  const { date, locale } = await params;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    notFound();
  }

  try {
    const dailyNews = await getNewsByDate(new Date(date), locale);

    if (dailyNews.news.length === 0)
      return <NotFoundDisplay date={date} locale={locale} />;

    return <NewsArticlePage dailyNews={dailyNews} locale={locale} />;
  } catch {
    return <ErrorDisplay date={date} locale={locale} />;
  }
}
