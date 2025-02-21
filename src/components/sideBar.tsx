"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { Locale } from "@/lib/types";
import { getDates } from "@/lib/frontQuery";

type Props = {
  whatFor: "mobile" | "pc";
};

export default function Sidebar({ whatFor }: Props) {
  const router = useRouter();
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [openMonth, setOpenMonth] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsDates, setNewsDates] = useState<
    Record<number, Record<number, number[]>>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("side_bar");
  const locale = useLocale() as Locale;
  const localeClass = sansLocaledClassName(locale);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates = await getDates();
        const formattedDates: Record<number, Record<number, number[]>> = {};

        dates.forEach((date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = d.getMonth() + 1;
          const day = d.getDate();

          if (!formattedDates[year]) formattedDates[year] = {};
          if (!formattedDates[year][month]) formattedDates[year][month] = [];

          formattedDates[year][month].push(day);
        });

        setNewsDates(formattedDates);
        if (Object.keys(formattedDates).length === 1)
          setOpenYear(Number(Object.keys(formattedDates)[0]));
      } catch (error) {
        console.error("Failed to fetch news dates", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handleDateClick = (year: number, month: number, day: number) => {
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    router.push(`/${formattedDate}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/?title=${encodedQuery}`);
  };

  return (
    <aside
      className={`w-64 bg-gray-900 text-white h-[calc(100vh-4rem)] sticky top-16 left-0 flex-shrink-0 ${
        whatFor === "mobile" ? "lg:hidden block" : "hidden lg:block"
      }`}
    >
      <div className="p-4 h-full overflow-y-auto">
        <form
          onSubmit={handleSearch}
          className="flex items-center space-x-2 mb-4"
        >
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

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-700 h-10 rounded w-full animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          Object.keys(newsDates)
            .map(Number)
            .sort((a, b) => b - a)
            .map((year) => (
              <div key={year} className="mb-3">
                <button
                  className={cn(
                    "w-full text-left font-bold bg-gray-800 p-2 rounded-md",
                    localeClass
                  )}
                  onClick={() => setOpenYear(openYear === year ? null : year)}
                >
                  {year}
                </button>

                {openYear === year &&
                  Object.keys(newsDates[year])
                    .map(Number)
                    .sort((a, b) => b - a)
                    .map((month) => (
                      <div key={month} className="ml-4 mt-1">
                        <button
                          className={cn(
                            "w-full text-left font-bold bg-gray-700 p-2 rounded-md",
                            localeClass
                          )}
                          onClick={() =>
                            setOpenMonth(openMonth === month ? null : month)
                          }
                        >
                          {year}/{month}
                        </button>

                        {openMonth === month && (
                          <ul className="mt-1 pl-4">
                            {newsDates[year][month].map((day) => (
                              <li
                                key={day}
                                className={cn(
                                  "text-sm bg-gray-600 p-2 rounded-md mb-1 cursor-pointer",
                                  localeClass
                                )}
                                onClick={() =>
                                  handleDateClick(year, month, day)
                                }
                              >
                                {month}/{day}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
              </div>
            ))
        )}
      </div>
    </aside>
  );
}
