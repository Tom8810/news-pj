import { useTranslations } from "next-intl";

export const NewsContentFooter = () => {
  const t = useTranslations("footer");
  return (
    <footer className="bg-black text-white text-center p-4 tracking-wide">
      {t("text")}
    </footer>
  );
};
