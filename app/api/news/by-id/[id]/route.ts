import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const news = await prisma.news.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          error: "News not found",
          message: `News with ID ${id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
      message: "News retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch news",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const {
      title,
      excerpt,
      content,
      featuredImage,
      tags,
      isPublished,
      publishedAt,
    } = await req.json();

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          error: "News not found",
          message: `News with ID ${id} not found`,
        },
        { status: 404 }
      );
    }

    const updateData: any = {
      title,
      excerpt,
      content,
      featuredImage,
      tags: tags || [],
      isPublished: isPublished || false,
    };

    // Update slug if title changed
    if (title && title !== existingNews.title) {
      const baseSlug = slugify(title);
      let slug = baseSlug;
      let counter = 1;
      while (
        await prisma.news.findFirst({
          where: { slug, id: { not: id } },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Handle published date
    if (isPublished && publishedAt) {
      updateData.publishedAt = new Date(publishedAt);
    } else if (isPublished && !existingNews.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (!isPublished) {
      updateData.publishedAt = null;
    }

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
      include: { author: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: "News updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to update news",
      },
      { status: 500 }
    );
  }
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "news");

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }

    // Remove image file if it exists
    if (existingNews.featuredImage) {
      const imagePath = path.join(
        UPLOAD_DIR,
        path.basename(existingNews.featuredImage)
      );
      try {
        await fs.unlink(imagePath);
      } catch (err: any) {
        // Ignore error if file does not exist
        if (err.code !== "ENOENT") throw err;
      }
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "News and image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
