-- AlterTable
ALTER TABLE `news_cn` MODIFY `text` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `news_en` MODIFY `text` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `news_ja` MODIFY `text` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `tags_cn` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `tags_en` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `tags_ja` MODIFY `description` TEXT NULL;
