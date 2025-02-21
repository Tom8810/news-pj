import {
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Noto_Serif,
  Noto_Serif_JP,
  Noto_Serif_SC,
} from "next/font/google";

// 英語用
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});

// 日本語用
export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});

// 中国語用
export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});

// 英語用
export const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});

// 日本語用
export const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});

// 中国語用
export const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  display: "swap",
});
