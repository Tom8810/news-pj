import { DailyNews } from "@/lib/types";
import React from "react";
import NewsDetailHeader from "./NewsDetailHeader";
import { DetailArticleContainer } from "./articleContainer/DetailArticleContainer";

type Props = {
  dailyNews: DailyNews;
  locale: string;
};

export async function NewsArticlePage({ dailyNews, locale }: Props) {
  return (
    <div className="flex flex-col w-full">
      <NewsDetailHeader date={dailyNews.date} />
      <main className="w-full mx-auto px-6 py-8 space-y-10">
        {dailyNews.news.map((article) => (
          <DetailArticleContainer
            date={dailyNews.date}
            article={article}
            locale={locale}
            key={article.id}
          />
        ))}
      </main>
    </div>
  );
}
