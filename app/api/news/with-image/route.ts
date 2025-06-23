import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import slugify from "slugify";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "news");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const isPublished = formData.get("isPublished") === "true";
    const publishedAt = formData.get("publishedAt") as string | null;
    let featuredImage: string | null = null;

    const imageValue = formData.get("image");
    if (imageValue && typeof imageValue !== "string") {
      const file = imageValue as File;
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        await fs.writeFile(filePath, buffer);
        featuredImage = `/uploads/news/${fileName}`;
      }
    }

    const slug = slugify(title, { lower: true, strict: true });

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        tags,
        isPublished,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        featuredImage,
      },
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: "News created successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
