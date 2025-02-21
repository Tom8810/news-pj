import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { cn, sansLocaledClassName } from "@/lib/utils";
import { Locale } from "@/lib/types";

export default function NotFound() {
  const t = useTranslations("not_found");
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-gray-200 to-gray-300 text-gray-900">
      <div
        className={cn(
          "bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-8 md:p-12 max-w-lg text-center"
        )}
      >
        <h1 className="text-5xl font-extrabold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold mt-2 text-gray-700">
          {t("title")}
        </h2>
        <p className="mt-3 text-lg text-gray-600">{t("description")}</p>
        <Link
          href="/"
          className={cn(
            "mt-6 inline-block px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition",
            sansLocaledClassName(locale as Locale)
          )}
        >
          {t("back_home")}
        </Link>
      </div>
    </div>
  );
}
