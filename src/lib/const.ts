export const LOCALELANGUAGES = {
  ja: "日本語",
  en: "English",
  cn: "中文",
};

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.ENV === "staging"
    ? process.env.NEXT_PUBLIC_BASE_URL_STG
    : process.env.NEXT_PUBLIC_BASE_URL_PRD;
