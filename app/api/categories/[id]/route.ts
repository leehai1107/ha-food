import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteImageFile(imageUrl: string) {
  if (!imageUrl) return;
  const imagePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await fs.promises.unlink(imagePath);
  } catch (err) {
    // Ignore error if file doesn't exist
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const includeProducts = searchParams.get("includeProducts") === "true";
    const idNum = parseInt(id);

    const category = await prisma.category.findUnique({
      where: { id: idNum },
      include: {
        parent: true,
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { children: true, products: true } },
        ...(includeProducts && {
          products: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        }),
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
          message: `Category with ID ${idNum} does not exist`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch category",
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
    const { id } = await params;
    const idNum = parseInt(id);
    const { name, description, imageUrl, parentId, priority, visible } =
      await req.json();

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

    if (parentId && idNum === parentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          message: "Category cannot be its own parent",
        },
        { status: 400 }
      );
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
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
      // Check for circular reference (simplified)
      const descendants = await prisma.category.findMany({
        where: { parentId: idNum },
      });
      if (descendants.some((desc) => desc.id === parentId)) {
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

    // Fetch the existing category to get the old imageUrl
    const existingCategory = await prisma.category.findUnique({
      where: { id: idNum },
      select: { imageUrl: true },
    });

    // If the image is being changed or removed, delete the old image file
    if (existingCategory?.imageUrl && existingCategory.imageUrl !== imageUrl) {
      await deleteImageFile(existingCategory.imageUrl);
    }

    const category = await prisma.category.update({
      where: { id: idNum },
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        parentId: parentId || null,
        ...(priority !== undefined ? { priority } : {}),
        ...(visible !== undefined ? { visible } : {}),
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
    if (error.code === "P2025") {
      const { id } = await params;
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
          message: `Category with ID ${id} does not exist`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to update category",
      },
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
    const idNum = parseInt(id);

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: idNum },
    });
    if (childrenCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Constraint violation",
          message: `Cannot delete category. ${childrenCount} subcategories depend on this category.`,
        },
        { status: 400 }
      );
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: idNum },
    });
    if (productsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Constraint violation",
          message: `Cannot delete category. ${productsCount} products are assigned to this category.`,
        },
        { status: 400 }
      );
    }

    const category = await prisma.category.delete({
      where: { id: idNum },
    });

    if (category.imageUrl) {
      await deleteImageFile(category.imageUrl);
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      const { id } = await params;
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
          message: `Category with ID ${id} does not exist`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}
