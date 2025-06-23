import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");

async function ensureDirSync(dir: string) {
  try {
    await writeFile(path.join(dir, ".keep"), "");
  } catch (error: any) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        parentId: true,
        createdAt: true,
        priority: true,
        visible: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
          message: `Category with ID ${idNum} does not exist`,
        },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string;
    const file = formData.get("image") as File;
    const priorityRaw = formData.get("priority");
    const visibleRaw = formData.get("visible");
    const priority =
      typeof priorityRaw === "string"
        ? parseInt(priorityRaw)
        : existingCategory.priority;
    const visible =
      typeof visibleRaw === "string"
        ? visibleRaw === "true"
        : existingCategory.visible;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    // Validate parent category if provided
    if (parentId) {
      const parentIdNum = parseInt(parentId);
      if (parentIdNum === idNum) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            message: "Category cannot be its own parent",
          },
          { status: 400 }
        );
      }

      const parentCategory = await prisma.category.findUnique({
        where: { id: parentIdNum },
      });
      if (!parentCategory) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            message: "Parent category does not exist",
          },
          { status: 400 }
        );
      }

      // Check for circular reference
      const descendants = await prisma.category.findMany({
        where: { parentId: idNum },
      });
      if (descendants.some((desc) => desc.id === parentIdNum)) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            message: "Cannot create circular reference in category hierarchy",
          },
          { status: 400 }
        );
      }
    }

    // Handle image upload if provided
    let imageUrl = existingCategory.imageUrl;
    if (file) {
      await ensureDirSync(uploadDir);

      // Delete old image if exists
      if (existingCategory.imageUrl) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingCategory.imageUrl
        );
        try {
          await fs.promises.unlink(oldImagePath);
        } catch (error) {
          // Ignore error if file doesn't exist
        }
      }

      // Generate unique filename
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const newImagePath = path.join(uploadDir, filename);

      // Save new image
      await writeFile(newImagePath, buffer);
      imageUrl = `/uploads/categories/${filename}`;
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: idNum },
      data: {
        name,
        description: description || null,
        imageUrl,
        parentId: parentId ? parseInt(parentId) : null,
        priority,
        visible,
      },
      include: {
        parent: true,
        children: true,
        _count: { select: { children: true, products: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message || "Failed to update category",
      },
      { status: 500 }
    );
  }
}
