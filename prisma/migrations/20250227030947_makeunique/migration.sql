/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tags_cn` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tags_en` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tags_ja` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tags_cn_name_key" ON "tags_cn"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_en_name_key" ON "tags_en"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_ja_name_key" ON "tags_ja"("name");
