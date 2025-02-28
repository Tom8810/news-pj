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
