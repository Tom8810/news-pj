"use client";

import { Locale } from "@/lib/types";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  date: string;
};

export default function NewsDetailHeader({ date }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("detail");

  return (
    <div className="flex flex-col justify-center items-center md:flex-row gap-8 pt-10 relative w-full">
      <h1
        className={cn(
          "text-3xl font-bold text-gray-900",
          sansLocaledClassName(locale)
        )}
      >
        {t("title", { date })}
      </h1>
      <Link
        href={`/${locale}`}
        className={cn(
          "inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition md:absolute right-6",
          sansLocaledClassName(locale as Locale)
        )}
      >
        {t("back_to_list")}
      </Link>
    </div>
  );
}
