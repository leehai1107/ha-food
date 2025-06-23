import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/jwt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// GET /api/galleries/[id]/images/[imageId] - Get a specific gallery image
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const galleryId = parseInt(id);
    const imageIdNum = parseInt(imageId);

    if (isNaN(galleryId) || isNaN(imageIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "Gallery ID and Image ID must be numbers",
        },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.findFirst({
      where: {
        id: imageIdNum,
        galleryId: galleryId,
      },
      include: {
        gallery: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Gallery image not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image,
      message: "Gallery image retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch gallery image",
      },
      { status: 500 }
    );
  }
}

// Helper to delete an image file
async function deleteImageFile(imageUrl: string) {
  if (!imageUrl) return;
  const imagePath = path.join(process.cwd(), "public", imageUrl);
  try {
    await fs.promises.unlink(imagePath);
  } catch (err) {
    // Ignore error if file doesn't exist
  }
}

// PUT /api/galleries/[id]/images/[imageId] - Update a gallery image
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const galleryId = parseInt(id);
    const imageIdNum = parseInt(imageId);

    if (isNaN(galleryId) || isNaN(imageIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "Gallery ID and Image ID must be numbers",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { imageUrl, altText, position } = body;

    // Check if image exists
    const existingImage = await prisma.galleryImage.findFirst({
      where: {
        id: imageIdNum,
        galleryId: galleryId,
      },
    });

    if (!existingImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Gallery image not found",
        },
        { status: 404 }
      );
    }

    // If imageUrl is being changed, delete the old image file
    if (
      imageUrl !== undefined &&
      imageUrl !== existingImage.imageUrl &&
      existingImage.imageUrl
    ) {
      await deleteImageFile(existingImage.imageUrl);
    }

    // Prepare update data
    const updateData: any = {};
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }
    if (altText !== undefined) {
      updateData.altText = altText;
    }
    if (position !== undefined) {
      updateData.position = position;
    }

    // Update image
    const image = await prisma.galleryImage.update({
      where: { id: imageIdNum },
      data: updateData,
      include: {
        gallery: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: image,
      message: "Gallery image updated successfully",
    });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to update gallery image",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/galleries/[id]/images/[imageId] - Delete a gallery image
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const galleryId = parseInt(id);
    const imageIdNum = parseInt(imageId);

    if (isNaN(galleryId) || isNaN(imageIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "Gallery ID and Image ID must be numbers",
        },
        { status: 400 }
      );
    }

    // Check if image exists
    const existingImage = await prisma.galleryImage.findFirst({
      where: {
        id: imageIdNum,
        galleryId: galleryId,
      },
    });

    if (!existingImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Gallery image not found",
        },
        { status: 404 }
      );
    }

    // Delete image file from disk
    if (existingImage.imageUrl) {
      await deleteImageFile(existingImage.imageUrl);
    }

    // Delete image
    await prisma.galleryImage.delete({
      where: { id: imageIdNum },
    });

    return NextResponse.json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to delete gallery image",
      },
      { status: 500 }
    );
  }
}
