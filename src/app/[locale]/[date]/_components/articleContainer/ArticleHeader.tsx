import { NewsTag } from "@/lib/types";
import { formatLocaleDate } from "@/lib/utils";

export const ArticleHeader = ({
  title,
  date,
  locale,
}: {
  title: string;
  date: Date;
  locale: string;
}) => {
  return (
    <header className="border-b border-gray-300 pb-3">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <time>{formatLocaleDate(new Date(date), locale)}</time>
      </div>
    </header>
  );
};
