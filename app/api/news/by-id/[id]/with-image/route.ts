import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "news");

async function removeFileIfExists(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    // Ignore error if file does not exist
    if (err.code !== "ENOENT") throw err;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const formData = await req.formData();
    const featuredImageValue = formData.get("image");

    let featuredImage: string | null = null;

    if (featuredImageValue && typeof featuredImageValue !== "string") {
      // It's a File
      const file = featuredImageValue as File;
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        // Ensure upload directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        // Save file to disk
        await fs.writeFile(filePath, buffer);

        // Set the path to be stored in DB (relative to public)
        featuredImage = `/uploads/news/${fileName}`;
      }
    } else if (typeof featuredImageValue === "string") {
      featuredImage = featuredImageValue;
    }

    const existingNews = await prisma.news.findUnique({
      where: { id: parsedId },
    });
    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }

    // Remove old image if it exists and is different
    if (
      existingNews.featuredImage &&
      featuredImage &&
      existingNews.featuredImage !== featuredImage
    ) {
      const oldImagePath = path.join(
        UPLOAD_DIR,
        path.basename(existingNews.featuredImage)
      );
      await removeFileIfExists(oldImagePath);
    }

    const news = await prisma.news.update({
      where: { id: parsedId },
      data: { featuredImage },
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: "News image updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id);
    const existingNews = await prisma.news.findUnique({
      where: { id: parsedId },
    });
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
      await removeFileIfExists(imagePath);
    }

    await prisma.news.delete({ where: { id: parsedId } });

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
