import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/galleries/[id] - Get a specific gallery
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryId = parseInt(id);
    if (isNaN(galleryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Gallery ID must be a number'
      }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const includeImages = searchParams.get('includeImages') === 'true';

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: {
        images: includeImages ? {
          orderBy: { position: 'asc' }
        } : false,
        _count: {
          select: { images: true }
        }
      }
    });

    if (!gallery) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Gallery not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: gallery,
      message: 'Gallery retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch gallery'
    }, { status: 500 });
  }
}

// PUT /api/galleries/[id] - Update a gallery
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryId = parseInt(id);
    if (isNaN(galleryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Gallery ID must be a number'
      }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, tags, isActive } = body;

    // Check if gallery exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!existingGallery) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Gallery not found'
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Gallery name cannot be empty'
        }, { status: 400 });
      }
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : [];
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Update gallery
    const gallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: updateData,
      include: {
        _count: {
          select: { images: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: gallery,
      message: 'Gallery updated successfully'
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update gallery'
    }, { status: 500 });
  }
}

// DELETE /api/galleries/[id] - Delete a gallery
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryId = parseInt(id);
    if (isNaN(galleryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Gallery ID must be a number'
      }, { status: 400 });
    }

    // Check if gallery exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!existingGallery) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Gallery not found'
      }, { status: 404 });
    }

    // Delete gallery (images will be deleted automatically due to cascade)
    await prisma.gallery.delete({
      where: { id: galleryId }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete gallery'
    }, { status: 500 });
  }
} 