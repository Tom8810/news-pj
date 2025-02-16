import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, locale } = body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        locale,
      },
    });

    // Revalidate the page for ISR
    revalidatePath(`/${locale}`);

    return NextResponse.json(post, { status: 201 });
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
