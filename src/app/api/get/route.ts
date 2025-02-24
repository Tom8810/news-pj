import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import NodeCache from "node-cache";
import { DailyNews, Locale } from "@/lib/types";
import { LRUCache } from "lru-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const rateLimit = new LRUCache<string, { count: number; timestamp: number }>({
  max: 1000, // 最大1000 IP を記録（十分なサイズを確保）
  ttl: 60 * 1000, // 60秒間の有効期限
});

const globalRateLimit = new LRUCache<
  string,
  { count: number; timestamp: number }
>({
  max: 10000, // 最大リクエスト数（例: 10,000）
  ttl: 60 * 1000, // 60秒間のリクエストを制限
});

const allowedIPs = [
  process.env.API_ALLOW_IP_1,
  process.env.API_ALLOW_IP_2,
  process.env.API_ALLOW_IP_3,
];

export async function GET(req: NextRequest): Promise<Response> {
  // タイムアウト：5秒
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const now = Date.now();
  const globalKey = "global_requests";
  const globalRequestInfo = globalRateLimit.get(globalKey) || {
    count: 0,
    timestamp: now,
  };

  // **グローバルレートリミットのチェック**
  if (
    now - globalRequestInfo.timestamp < 60 * 1000 &&
    globalRequestInfo.count >= 10000
  ) {
    return NextResponse.json(
      { error: "Too many global requests" },
      { status: 503 }
    );
  }

  // **カウントを増やす**
  globalRateLimit.set(globalKey, {
    count: globalRequestInfo.count + 1,
    timestamp: now,
  });

  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!ip || !allowedIPs.includes(ip)) {
    console.log(ip);
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (ip !== "unknown") {
    const ipRequestInfo = rateLimit.get(ip) || { count: 0, timestamp: now };

    // **IPベースのレートリミットのチェック**
    if (
      now - ipRequestInfo.timestamp < 60 * 1000 &&
      ipRequestInfo.count >= 100
    ) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // **IPのリクエストカウントを更新**
    rateLimit.set(ip, {
      count: ipRequestInfo.count + 1,
      timestamp: now,
    });
  }

  try {
    const url = new URL(req.nextUrl);
    const mode = url.searchParams.get("mode") || "";
    const title = url.searchParams.get("title") || "";
    const locale = (url.searchParams.get("locale") || "ja") as Locale;
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const dateParam = url.searchParams.get("date") || "";

    const cacheKey = `mode:${mode}_locale:${locale}_page:${page}_limit:${limit}_title:${title}_date:${dateParam}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return NextResponse.json(cachedData);

    if (mode === "list") {
      let totalDays: number;
      let paginatedDates: { date: Date; id: number }[] = [];
      const groupedNews: DailyNews[] = [];

      if (locale === "ja") {
        // 該当するニュースの日数を取得
        totalDays = await prisma.news_ja
          .groupBy({
            by: ["datekey_id"],
            where: title ? { title: { contains: title } } : {},
            _count: true,
          })
          .then((res) => res.length); // ヒットした日数を取得

        // ヒットした日付のリストを取得（ページネーション適用）
        paginatedDates = await prisma.news_ja_datekey.findMany({
          where: {
            id: {
              in: await prisma.news_ja
                .findMany({
                  where: title ? { title: { contains: title } } : {},
                  select: { datekey_id: true },
                  distinct: ["datekey_id"],
                  orderBy: { datekey_id: "desc" },
                  skip: (page - 1) * limit,
                  take: limit,
                })
                .then((res) => res.map((r) => r.datekey_id)),
            },
          },
          orderBy: { date: "desc" },
        });

        for (const dateRecord of paginatedDates) {
          const newsForDate = await prisma.news_ja.findMany({
            where: {
              datekey_id: dateRecord.id,
              ...(title ? { title: { contains: title } } : {}),
            },
            orderBy: { id: "desc" },
            include: { news_tags: { include: { tag: true } } },
          });

          if (newsForDate.length > 0) {
            groupedNews.push({
              date: dateRecord.date.toISOString().split("T")[0],
              news: newsForDate,
            });
          }
        }
      } else if (locale === "en") {
        totalDays = await prisma.news_en
          .groupBy({
            by: ["datekey_id"],
            where: title ? { title: { contains: title } } : {},
            _count: true,
          })
          .then((res) => res.length);

        paginatedDates = await prisma.news_en_datekey.findMany({
          where: {
            id: {
              in: await prisma.news_en
                .findMany({
                  where: title ? { title: { contains: title } } : {},
                  select: { datekey_id: true },
                  distinct: ["datekey_id"],
                  orderBy: { datekey_id: "desc" },
                  skip: (page - 1) * limit,
                  take: limit,
                })
                .then((res) => res.map((r) => r.datekey_id)),
            },
          },
          orderBy: { date: "desc" },
        });

        for (const dateRecord of paginatedDates) {
          const newsForDate = await prisma.news_en.findMany({
            where: {
              datekey_id: dateRecord.id,
              ...(title ? { title: { contains: title } } : {}),
            },
            orderBy: { id: "desc" },
            include: { news_tags: { include: { tag: true } } },
          });

          if (newsForDate.length > 0) {
            groupedNews.push({
              date: dateRecord.date.toISOString().split("T")[0],
              news: newsForDate,
            });
          }
        }
      } else {
        totalDays = await prisma.news_cn
          .groupBy({
            by: ["datekey_id"],
            where: title ? { title: { contains: title } } : {},
            _count: true,
          })
          .then((res) => res.length);

        paginatedDates = await prisma.news_cn_datekey.findMany({
          where: {
            id: {
              in: await prisma.news_cn
                .findMany({
                  where: title ? { title: { contains: title } } : {},
                  select: { datekey_id: true },
                  distinct: ["datekey_id"],
                  orderBy: { datekey_id: "desc" },
                  skip: (page - 1) * limit,
                  take: limit,
                })
                .then((res) => res.map((r) => r.datekey_id)),
            },
          },
          orderBy: { date: "desc" },
        });

        for (const dateRecord of paginatedDates) {
          const newsForDate = await prisma.news_cn.findMany({
            where: {
              datekey_id: dateRecord.id,
              ...(title ? { title: { contains: title } } : {}),
            },
            orderBy: { id: "desc" },
            include: { news_tags: { include: { tag: true } } },
          });

          if (newsForDate.length > 0) {
            groupedNews.push({
              date: dateRecord.date.toISOString().split("T")[0],
              news: newsForDate,
            });
          }
        }
      }

      const responseData = {
        news: groupedNews,
        total: totalDays,
        page,
        limit,
        totalPages: Math.ceil(totalDays / limit),
      };
      cache.set(cacheKey, responseData);
      return NextResponse.json(responseData);
    } else if (mode === "date_only") {
      let allDates;
      if (locale === "ja") {
        allDates = await prisma.news_ja_datekey.findMany({
          select: { date: true },
          orderBy: { date: "desc" },
        });
      } else if (locale === "en") {
        allDates = await prisma.news_en_datekey.findMany({
          select: { date: true },
          orderBy: { date: "desc" },
        });
      } else {
        allDates = await prisma.news_cn_datekey.findMany({
          select: { date: true },
          orderBy: { date: "desc" },
        });
      }
      const responseData = allDates.map(
        ({ date }) => date.toISOString().split("T")[0]
      );
      cache.set(cacheKey, responseData);
      return NextResponse.json(responseData);
    } else if (mode === "date") {
      if (!dateParam) {
        return NextResponse.json(
          { error: "Missing date parameter" },
          { status: 400 }
        );
      }

      const targetDate = new Date(dateParam);
      if (isNaN(targetDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }

      let dateRecord;
      let newsList;

      if (locale === "ja") {
        dateRecord = await prisma.news_ja_datekey.findFirst({
          where: { date: targetDate },
        });
        if (!dateRecord)
          return NextResponse.json({ date: targetDate, news: [] });
        newsList = await prisma.news_ja.findMany({
          where: { datekey_id: dateRecord.id },
          orderBy: { id: "desc" },
          include: { news_tags: { include: { tag: true } } },
        });
      } else if (locale === "en") {
        dateRecord = await prisma.news_en_datekey.findFirst({
          where: { date: targetDate },
        });
        if (!dateRecord)
          return NextResponse.json({ date: targetDate, news: [] });
        newsList = await prisma.news_en.findMany({
          where: { datekey_id: dateRecord.id },
          orderBy: { id: "desc" },
          include: { news_tags: { include: { tag: true } } },
        });
      } else {
        dateRecord = await prisma.news_cn_datekey.findFirst({
          where: { date: targetDate },
        });
        if (!dateRecord)
          return NextResponse.json({ date: targetDate, news: [] });
        newsList = await prisma.news_cn.findMany({
          where: { datekey_id: dateRecord.id },
          orderBy: { id: "desc" },
          include: { news_tags: { include: { tag: true } } },
        });
      }

      const responseData = {
        date: targetDate.toISOString().split("T")[0],
        news: newsList,
      };
      cache.set(cacheKey, responseData);
      return NextResponse.json(responseData);
    } else {
      throw "error: no such mode";
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch data: ${error}` },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
