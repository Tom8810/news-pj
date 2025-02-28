"use client";

import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  localeClass: string;
  newsDates: Record<number, Record<number, number[]>>;
};

export const SideBarDateBox = ({ localeClass, newsDates }: Props) => {
  const router = useRouter();
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [openMonth, setOpenMonth] = useState<number | null>(null);

  useEffect(() => {
    if (Object.keys(newsDates).length === 1)
      setOpenYear(Number(Object.keys(newsDates)[0]));
  }, [newsDates]);

  const handleDateClick = (year: number, month: number, day: number) => {
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    router.push(`/${formattedDate}`);
  };

  return Object.keys(newsDates)
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
                        onClick={() => handleDateClick(year, month, day)}
                      >
                        {month}/{day}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
      </div>
    ));
};
