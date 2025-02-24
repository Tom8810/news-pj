import { Locale, DailyNews } from "./types";
import { BASE_URL } from "./const";

/**
 * 指定された条件でニュース一覧を取得する関数
 */
export const getNewsList = async (
  title: string = "",
  locale: Locale,
  page: number = 1,
  limit: number = 10
): Promise<{ news: DailyNews[]; totalPages: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/get?mode=list&locale=${locale}&title=${encodeURIComponent(
        title
      )}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { news: DailyNews[]; totalPages: number } =
      await response.json();

    data.news.map((dailyNews) => {
      const date = new Date(dailyNews.date);
      return (dailyNews.date = date.toISOString().split("T")[0]);
    });

    return {
      news: data.news,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch news list", error);
    throw error;
  }
};

export const getNewsByDate = async (
  date: Date,
  locale: Locale
): Promise<DailyNews> => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/get?mode=date&locale=${locale}&date=${encodeURIComponent(
        date.toISOString().split("T")[0]
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DailyNews = await response.json();

    const newsDate = new Date(data.date);

    data.date = newsDate.toISOString().split("T")[0];

    return data;
  } catch (error) {
    console.error("Failed to fetch daily news", error);
    throw error;
  }
};

export const getDates = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/get?mode=date_only`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: string[] = await response.json();

    return data.map((date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // "YYYY-MM-DD" の文字列を返す
    });
  } catch (error) {
    console.error("Failed to fetch dates", error);
    throw error;
  }
};
