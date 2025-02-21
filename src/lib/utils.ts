import { notoSans, notoSansJP, notoSansSC } from "./font";
import { Locale } from "./types";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const formatLocaleDate = (date: Date, locale: string) => {
  if (locale === "ja") {
    return date.toLocaleDateString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
    });
  } else if (locale === "en") {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
    });
  } else if (locale === "cn") {
    return date.toLocaleDateString("zh-CN", {
      month: "long",
      day: "2-digit",
    });
  }
  return date.toLocaleDateString();
};

export const sansLocaledClassName = (locale: Locale) => {
  if (locale === "ja") return notoSansJP.className;
  if (locale === "en") return notoSans.className;
  return notoSansSC.className;
};
