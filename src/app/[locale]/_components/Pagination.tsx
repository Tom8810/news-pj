"use client";

import { Locale } from "@/lib/types";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("list");
  const locale = useLocale();
  return (
    <div
      className={cn(
        "flex justify-center items-center mt-6 space-x-2",
        sansLocaledClassName(locale as Locale)
      )}
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "px-4 py-2 rounded-md transition-colors min-w-28 font-bold",
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-600"
        )}
      >
        {t("pagination_previous")}
      </button>

      <span className="px-4 py-2 text-gray-800 font-bold">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "px-4 py-2 rounded-md transition-colors min-w-28 font-bold",

          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 text-white hover:bg-gray-600"
        )}
      >
        {t("pagination_next")}
      </button>
    </div>
  );
}
