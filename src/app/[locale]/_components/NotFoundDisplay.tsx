import { useTranslations } from "next-intl";
import Image from "next/image";

export const NotFoundDisplay = () => {
  const t = useTranslations("list");
  return (
    <div className="flex flex-col items-center justify-center text-gray-500 text-lg mt-12 bg-white">
      <Image
        src="/apologize.png"
        alt={t("not_found_message")}
        width={240}
        height={240}
        className="mb-4"
      />
      <p>{t("not_found_message")}</p>
    </div>
  );
};
