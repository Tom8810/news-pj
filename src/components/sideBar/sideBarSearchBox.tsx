"use client";

import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

type Props = {
  localeClass: string;
};

export const SideBarSearchBox = ({ localeClass }: Props) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("side_bar");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/explore?title=${encodedQuery}&page=1`);
  };
  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder={t("search")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(
          "flex-1 p-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500 w-3/4 h-10",
          localeClass
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
    </form>
  );
};
