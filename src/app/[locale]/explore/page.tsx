"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NewsList from "../_components/NewsList";
import { Locale, DailyNews } from "../../../lib/types";
import { useLocale, useTranslations } from "next-intl";
import { SearchBox } from "@/components/searchBox";
import { getNewsList } from "@/lib/frontQuery";
import Pagination from "../_components/Pagination";
import { NewsContentFooter } from "@/components/newsContentFooter";
import { cn, sansLocaledClassName } from "@/lib/utils";

export default function Home() {
  const [news, setNews] = useState<DailyNews[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const t = useTranslations("list");
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale() as Locale;

  // page を searchParams から取得（useState で管理しない）
  const page = parseInt(searchParams.get("page") || "1", 10);

  const fetchNews = useCallback(
    async (title: string = "", locale: Locale, page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getNewsList(title, locale, page, 1);
        setNews(data.news);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("News fetching error:", error);
        setError("Failed to fetch news");
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const titleParam = searchParams.get("title") || "";
    setSearchTerm(titleParam);
    fetchNews(titleParam, locale, page);
  }, [searchParams, page, fetchNews, locale]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("page", newPage.toString());
      router.push(`?${currentParams.toString()}`);
    },
    [searchParams, router]
  );

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
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <NewsList news={news} isLoading={isLoading} error={error} />

        {/* ページネーション */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <NewsContentFooter />
    </div>
  );
}
