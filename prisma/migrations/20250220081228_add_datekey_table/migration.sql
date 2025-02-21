/*
  Warnings:

  - You are about to drop the column `date` on the `news_cn` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `news_en` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `news_ja` table. All the data in the column will be lost.
  - Added the required column `datekey_id` to the `news_cn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datekey_id` to the `news_en` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datekey_id` to the `news_ja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `news_cn` DROP COLUMN `date`,
    ADD COLUMN `datekey_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `news_en` DROP COLUMN `date`,
    ADD COLUMN `datekey_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `news_ja` DROP COLUMN `date`,
    ADD COLUMN `datekey_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `news_ja_datekey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_en_datekey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_cn_datekey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `news_ja` ADD CONSTRAINT `news_ja_datekey_id_fkey` FOREIGN KEY (`datekey_id`) REFERENCES `news_ja_datekey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_en` ADD CONSTRAINT `news_en_datekey_id_fkey` FOREIGN KEY (`datekey_id`) REFERENCES `news_en_datekey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_cn` ADD CONSTRAINT `news_cn_datekey_id_fkey` FOREIGN KEY (`datekey_id`) REFERENCES `news_cn_datekey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
