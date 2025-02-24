import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Locale } from "@/lib/types";
import { LRUCache } from "lru-cache";
import jwt from "jsonwebtoken";

const rateLimit = new LRUCache<string, { count: number; timestamp: number }>({
  max: 10,
  ttl: 60 * 1000,
});

const globalRateLimit = new LRUCache<
  string,
  { count: number; timestamp: number }
>({
  max: 10,
  ttl: 60 * 1000,
});

const allowedIPs = [process.env.API_ALLOW_IP_1, process.env.API_ALLOW_IP_2];

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export async function POST(req: NextRequest): Promise<Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Authenticated user:", decoded);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const now = Date.now();
  const globalKey = "global_requests";
  const globalRequestInfo = globalRateLimit.get(globalKey) || {
    count: 0,
    timestamp: now,
  };

  if (
    now - globalRequestInfo.timestamp < 60 * 1000 &&
    globalRequestInfo.count >= 10
  ) {
    return NextResponse.json(
      { error: "Too many global requests" },
      { status: 503 }
    );
  }

  globalRateLimit.set(globalKey, {
    count: globalRequestInfo.count + 1,
    timestamp: now,
  });

  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!ip || !allowedIPs.includes(ip)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (ip !== "unknown") {
    const ipRequestInfo = rateLimit.get(ip) || { count: 0, timestamp: now };

    if (
      now - ipRequestInfo.timestamp < 60 * 1000 &&
      ipRequestInfo.count >= 10
    ) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    rateLimit.set(ip, { count: ipRequestInfo.count + 1, timestamp: now });
  }

  try {
    const body = await req.json();
    const {
      date,
      title,
      text,
      citation_url,
      tags, // 修正: tags の各要素を { name, description } の形で受け取る
      locale,
    }: {
      date: string;
      title: string;
      text: string;
      citation_url?: string;
      tags: { name: string; description: string }[]; // 修正: name と description を持つオブジェクトの配列
      locale: Locale;
    } = body;

    if (!date || !title || !text || !tags || !locale) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    let dateRecord;
    if (locale === "ja") {
      dateRecord =
        (await prisma.news_ja_datekey.findFirst({
          where: { date: targetDate },
        })) ||
        (await prisma.news_ja_datekey.create({ data: { date: targetDate } }));
    } else if (locale === "en") {
      dateRecord =
        (await prisma.news_en_datekey.findFirst({
          where: { date: targetDate },
        })) ||
        (await prisma.news_en_datekey.create({ data: { date: targetDate } }));
    } else {
      dateRecord =
        (await prisma.news_cn_datekey.findFirst({
          where: { date: targetDate },
        })) ||
        (await prisma.news_cn_datekey.create({ data: { date: targetDate } }));
    }

    let newsRecord;
    if (locale === "ja") {
      newsRecord = await prisma.news_ja.create({
        data: { title, text, citation_url, datekey_id: dateRecord.id },
      });
    } else if (locale === "en") {
      newsRecord = await prisma.news_en.create({
        data: { title, text, citation_url, datekey_id: dateRecord.id },
      });
    } else {
      newsRecord = await prisma.news_cn.create({
        data: { title, text, citation_url, datekey_id: dateRecord.id },
      });
    }

    for (const { name: tagName, description: tagDescription } of tags) {
      let tagRecord;
      if (locale === "ja") {
        tagRecord =
          (await prisma.tags_ja.findFirst({ where: { name: tagName } })) ||
          (await prisma.tags_ja.create({
            data: { name: tagName, description: tagDescription },
          }));

        await prisma.news_tag_ja.create({
          data: { news_id: newsRecord.id, tag_id: tagRecord.id },
        });
      } else if (locale === "en") {
        tagRecord =
          (await prisma.tags_en.findFirst({ where: { name: tagName } })) ||
          (await prisma.tags_en.create({
            data: { name: tagName, description: tagDescription },
          }));

        await prisma.news_tag_en.create({
          data: { news_id: newsRecord.id, tag_id: tagRecord.id },
        });
      } else {
        tagRecord =
          (await prisma.tags_cn.findFirst({ where: { name: tagName } })) ||
          (await prisma.tags_cn.create({
            data: { name: tagName, description: tagDescription },
          }));

        await prisma.news_tag_cn.create({
          data: { news_id: newsRecord.id, tag_id: tagRecord.id },
        });
      }
    }

    return NextResponse.json(
      { message: "News successfully created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create news: ${error}` },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
