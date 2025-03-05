/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `news_cn_datekey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `news_en_datekey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `news_ja_datekey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "news_cn_datekey_id_idx" ON "news_cn"("datekey_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_cn_datekey_date_key" ON "news_cn_datekey"("date");

-- CreateIndex
CREATE INDEX "news_cn_datekey_date_idx" ON "news_cn_datekey"("date");

-- CreateIndex
CREATE INDEX "news_en_datekey_id_idx" ON "news_en"("datekey_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_en_datekey_date_key" ON "news_en_datekey"("date");

-- CreateIndex
CREATE INDEX "news_en_datekey_date_idx" ON "news_en_datekey"("date");

-- CreateIndex
CREATE INDEX "news_ja_datekey_id_idx" ON "news_ja"("datekey_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_ja_datekey_date_key" ON "news_ja_datekey"("date");

-- CreateIndex
CREATE INDEX "news_ja_datekey_date_idx" ON "news_ja_datekey"("date");

-- CreateIndex
CREATE INDEX "news_tag_cn_news_id_idx" ON "news_tag_cn"("news_id");

-- CreateIndex
CREATE INDEX "news_tag_en_news_id_idx" ON "news_tag_en"("news_id");

-- CreateIndex
CREATE INDEX "news_tag_ja_news_id_idx" ON "news_tag_ja"("news_id");
