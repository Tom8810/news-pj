import NewsDetailHeader from "./NewsDetailHeader";
import { getTranslations } from "next-intl/server";

type Props = {
  date: string;
  locale: string;
};

export async function NotFoundDisplay({ date, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "detail" });
  return (
    <div className="flex flex-col w-full items-center">
      <NewsDetailHeader date={date} />
      <div className="bg-gray-100 rounded-lg p-6 shadow-md w-fit">
        <p className="text-lg text-gray-700">{t("not_found_message")}</p>
      </div>
    </div>
  );
}
