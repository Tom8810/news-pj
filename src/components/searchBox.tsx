"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { Locale } from "@/lib/types";
import { FiSearch, FiRefreshCcw } from "react-icons/fi";

type Props = {
  searchTerm?: string;
  setSearchTerm?: (newTerm: string) => void;
  isStatic?: boolean;
};

export const SearchBox = ({
  searchTerm = undefined,
  setSearchTerm = undefined,
  isStatic = false,
}: Props) => {
  const router = useRouter();
  const t = useTranslations("search_box");
  const locale = useLocale();
  const [searchTermForStatic, setSearchTermForStatic] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (isStatic) {
      searchTerm = searchTermForStatic;
    }
    if (!searchTerm) return;
    const trimmedQuery = searchTerm.trim();
    if (!trimmedQuery) return;

    const encodedQuery = encodeURIComponent(trimmedQuery);
    router.push(`/explore?title=${encodedQuery}`);
  };

  const handleReset = () => {
    if (isStatic) {
      if (searchTermForStatic === "") return;
      setSearchTermForStatic("");
    } else if (setSearchTerm) {
      if (searchTerm === "") return;
      setSearchTerm("");
    }
    router.push("/"); // リセット時にルートへ遷移
  };

  return (
    <form
      className="flex w-full max-w-md space-x-2 bg-gray-200 p-2 rounded-lg shadow-md md:max-w-lg"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        placeholder={t("placeholder")}
        value={isStatic ? searchTermForStatic : searchTerm}
        onChange={(e) => {
          const newTerm = e.target.value;
          if (isStatic) {
            setSearchTermForStatic(newTerm);
          } else if (setSearchTerm) {
            setSearchTerm(newTerm);
          }
        }}
        className={cn(
          "flex-grow p-2 rounded-md bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-500 min-w-24",
          sansLocaledClassName(locale as Locale)
        )}
      />
      <button
        type="submit"
        className="p-2 bg-gray-600 rounded-md hover:bg-gray-500 transition h-10 w-10 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label={t("search")}
        title={t("search")}
      >
        <FiSearch className="text-white" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="p-2 bg-gray-600 rounded-md hover:bg-gray-500 transition h-10 w-10 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label={t("reset")}
        title={t("reset")}
      >
        <FiRefreshCcw className="text-white" aria-hidden="true" />
      </button>
    </form>
  );
};
