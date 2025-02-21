import { DailyNews, News } from "../../../lib/types";
import { ErrorDisplay } from "./ErrorDisplay";
import { ListNewsContainer } from "./ListNewsContainer";
import { LoadingDisplay } from "./LoadingDisplay";
import { NotFoundDisplay } from "./NotFoundDisplay";

type Props = {
  news: DailyNews[];
  isLoading: boolean;
  error: string | null;
};

export default function NewsList({ news, isLoading, error }: Props) {
  if (isLoading) return <LoadingDisplay />;
  if (error) return <ErrorDisplay error={error} />;
  if (!news || news.length === 0) return <NotFoundDisplay />;

  return (
    <main className="min-h-screen p-8 w-full bg-white text-gray-900">
      <div className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {news.map((dailyNews) => (
          <ListNewsContainer dailyNews={dailyNews} key={dailyNews.date} />
        ))}
      </div>
    </main>
  );
}
