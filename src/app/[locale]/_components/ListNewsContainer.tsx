import { Link } from "@/i18n/routing";
import { DailyNews, Locale } from "@/lib/types";
import { cn, formatLocaleDate, sansLocaledClassName } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { ArticleImage } from "../../../components/articleImage";

type Props = {
  dailyNews: DailyNews;
};

export const ListNewsContainer = ({ dailyNews }: Props) => {
  const t = useTranslations("list");
  const locale = useLocale();

  const formatDateForUrl = (date: Date) => date.toISOString().split("T")[0];

  return (
    <Link
      href={`/${formatDateForUrl(new Date(dailyNews.date))}`}
      aria-label={`${t("news_item_title")} - ${formatLocaleDate(
        new Date(dailyNews.date.toString()),
        locale
      )}`}
      className="block focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg transition-shadow hover:shadow-lg"
      tabIndex={0}
    >
      <article className="border border-gray-300 p-4 rounded-lg shadow-md h-full bg-gray-100">
        <div className="aspect-video">
          <ArticleImage src="/mock_image.png" alt={"mock image"} />
        </div>
        <h2
          className={cn(
            "text-2xl font-semibold py-4 text-gray-800",
            sansLocaledClassName(locale as Locale)
          )}
        >
          {`${locale === "en" ? t("news_item_title") : ""}${formatLocaleDate(
            new Date(dailyNews.date.toString()),
            locale
          )}${locale !== "en" ? t("news_item_title") : ""}`}
        </h2>
        <div className="space-y-2">
          {dailyNews.news.map((news) => (
            <div
              key={news.id}
              className="p-3 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-gray-700">{news.title}</span>
            </div>
          ))}
        </div>
      </article>
    </Link>
  );
};
