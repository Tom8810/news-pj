import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { Locale } from "@/lib/types";

// 悪質なスクレイピングボットをブロック
const blockedBots = ["AhrefsBot", "MJ12bot", "SemrushBot", "DotBot"];

// Bot checker middleware
const botMiddleware = async (request: NextRequest) => {
  const userAgent = request.headers.get("user-agent") || "";

  if (blockedBots.some((bot) => userAgent.includes(bot))) {
    return NextResponse.json(
      { error: "Bots are not allowed" },
      { status: 403 }
    );
  }
  return null;
};

// Intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales as Locale[],
  defaultLocale: routing.defaultLocale as Locale,
  localeDetection: true,
});

// Combined middleware
export async function middleware(request: NextRequest) {
  // First check for bots
  const botResponse = await botMiddleware(request);
  if (botResponse) return botResponse;

  // Then handle i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // i18n用のパスマッチング
    "/",
    "/(ja|en|cn)/:path*",

    // Bot対策用のパスマッチング（api等は除外）
    "/((?!api|_next|.*\\..*).*)",
  ],
};
