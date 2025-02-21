import { News } from "@/lib/types";
import { ArticleImage } from "../../../../../components/articleImage";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleText } from "./ArticleText";

type Props = {
  date: string;
  article: News;
  locale: string;
};

export const DetailArticleContainer = ({ date, article, locale }: Props) => {
  return (
    <article
      key={article.id}
      className="bg-gray-100 rounded-xl p-6 shadow-md flex flex-col md:flex-row gap-6"
    >
      <ArticleImage
        src="/mock_image.png"
        alt={article.title}
        className="md:w-1/3 "
      />

      <div className="md:w-full space-y-4">
        <ArticleHeader
          title={article.title}
          date={new Date(date)}
          locale={locale}
        />

        <div className="text-lg text-gray-700 leading-relaxed">
          <div className="whitespace-pre-wrap">
            <ArticleText text={article.text} tags={article.news_tags} />
          </div>
        </div>

        {article.citation_url && article.citation_url !== "" && (
          <div>
            <a
              href={article.citation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              more
            </a>
          </div>
        )}
      </div>
    </article>
  );
};
