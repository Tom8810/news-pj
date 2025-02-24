"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NewsList from "./_components/NewsList";
import { Locale, DailyNews } from "../../lib/types";
import { useLocale, useTranslations } from "next-intl";
import { SearchBox } from "@/components/searchBox";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { getNewsList } from "@/lib/frontQuery";
import Pagination from "./_components/Pagination";
import bcrypt from "bcryptjs";

export default function Home() {
  const [news, setNews] = useState<DailyNews[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const t = useTranslations("list");
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;

  const fetchNews = useCallback(
    async (title: string = "", locale: Locale, page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getNewsList(title, locale, page, 5);
        const hash = await bcrypt.hash("ueLz.C,GAp4B", 10);
        console.log(hash);
        setNews(data.news);
        setTotalPages(data.totalPages);
      } catch {
        console.error("News fetching error:", error);
        setError("Failed to fetch news");
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setNews, setTotalPages, setIsLoading, setError, error]
  );

  useEffect(() => {
    const titleParam = searchParams.get("title") || "";
    setSearchTerm(titleParam);
    fetchNews(titleParam, locale, page);
  }, [searchParams, page, fetchNews, locale]);

  const updateSearchTerm = useCallback((newTerm: string) => {
    setSearchTerm(newTerm);
  }, []);

  return (
    <div className="bg-white h-full w-full p-6">
      <div className="flex justify-between items-center mb-6 gap-8 px-6 flex-col lg:flex-row">
        <h1
          className={cn(
            "text-3xl font-semibold text-gray-800 whitespace-nowrap",
            sansLocaledClassName(locale as Locale)
          )}
        >
          {t("title")}
        </h1>
        <SearchBox searchTerm={searchTerm} setSearchTerm={updateSearchTerm} />
      </div>

      <NewsList news={news} isLoading={isLoading} error={error} />

      {/* ページネーション */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
