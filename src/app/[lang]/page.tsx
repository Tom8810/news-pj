import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 3600; // ISR - revalidate every hour

export default async function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const posts = await prisma.post.findMany({
    where: {
      locale: lang,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        {lang === "ja-JP"
          ? "ブログ記事"
          : lang === "zh-CN"
          ? "博客文章"
          : "Blog Posts"}
      </h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.id} className="border p-4 rounded-lg">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.content}</p>
            <div className="mt-4 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(lang)}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
