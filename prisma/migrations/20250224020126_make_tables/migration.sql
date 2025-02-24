-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "hashed_password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_ja_datekey" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_ja_datekey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_ja" (
    "id" SERIAL NOT NULL,
    "datekey_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "citation_url" TEXT,

    CONSTRAINT "news_ja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_ja" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tags_ja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_tag_ja" (
    "news_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "news_tag_ja_pkey" PRIMARY KEY ("news_id","tag_id")
);

-- CreateTable
CREATE TABLE "news_en_datekey" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_en_datekey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_en" (
    "id" SERIAL NOT NULL,
    "datekey_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "citation_url" TEXT,

    CONSTRAINT "news_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_en" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tags_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_tag_en" (
    "news_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "news_tag_en_pkey" PRIMARY KEY ("news_id","tag_id")
);

-- CreateTable
CREATE TABLE "news_cn_datekey" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_cn_datekey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_cn" (
    "id" SERIAL NOT NULL,
    "datekey_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "citation_url" TEXT,

    CONSTRAINT "news_cn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_cn" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tags_cn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_tag_cn" (
    "news_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "news_tag_cn_pkey" PRIMARY KEY ("news_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "news_ja" ADD CONSTRAINT "news_ja_datekey_id_fkey" FOREIGN KEY ("datekey_id") REFERENCES "news_ja_datekey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_tag_ja" ADD CONSTRAINT "news_tag_ja_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news_ja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_tag_ja" ADD CONSTRAINT "news_tag_ja_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags_ja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_en" ADD CONSTRAINT "news_en_datekey_id_fkey" FOREIGN KEY ("datekey_id") REFERENCES "news_en_datekey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_tag_en" ADD CONSTRAINT "news_tag_en_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news_en"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_tag_en" ADD CONSTRAINT "news_tag_en_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags_en"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_cn" ADD CONSTRAINT "news_cn_datekey_id_fkey" FOREIGN KEY ("datekey_id") REFERENCES "news_cn_datekey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_tag_cn" ADD CONSTRAINT "news_tag_cn_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news_cn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_tag_cn" ADD CONSTRAINT "news_tag_cn_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags_cn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
