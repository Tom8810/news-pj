export type Tag = {
  id: number;
  name: string;
  description: string | null;
};

export type NewsTag = {
  news_id: number;
  tag_id: number;
  tag: Tag;
};

export type DailyNews = {
  date: string;
  news: News[];
};

export type News = {
  id: number;
  title: string;
  text: string;
  citation_url: string | null;
  news_tags: NewsTag[];
};

export type Locale = "ja" | "en" | "cn";
