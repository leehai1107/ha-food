import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

// GET /api/galleries/[id]/images - Get all images for a gallery
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
        error: 'Invalid gallery ID',
        message: 'Gallery ID must be a number'
      }, { status: 400 });
    }

    // Check if gallery exists
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!gallery) {
      return NextResponse.json({
        success: false,
        error: 'Gallery not found',
        message: 'Gallery does not exist'
      }, { status: 404 });
    }

    const images = await prisma.galleryImage.findMany({
      where: { galleryId },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: images,
      message: 'Gallery images retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch gallery images'
    }, { status: 500 });
  }
}

// POST /api/galleries/[id]/images - Add images to a gallery
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.accountId) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
        message: 'Authentication failed'
      }, { status: 401 });
    }

    const { id } = await params;
    const galleryId = parseInt(id);
    if (isNaN(galleryId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid gallery ID',
        message: 'Gallery ID must be a number'
      }, { status: 400 });
    }

    // Check if gallery exists
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!gallery) {
      return NextResponse.json({
        success: false,
        error: 'Gallery not found',
        message: 'Gallery does not exist'
      }, { status: 404 });
    }

    const body = await req.json();
    const { images } = body;

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Images array is required and cannot be empty'
      }, { status: 400 });
    }

    // Get current max position
    const maxPosition = await prisma.galleryImage.aggregate({
      where: { galleryId },
      _max: { position: true }
    });

    const startPosition = (maxPosition._max.position || 0) + 1;

    // Create images
    const imageData = images.map((image: any, index: number) => ({
      galleryId,
      imageUrl: image.imageUrl,
      altText: image.altText || null,
      position: image.position || (startPosition + index)
    }));

    const createdImages = await prisma.galleryImage.createMany({
      data: imageData
    });

    // Get the created images with full data
    const newImages = await prisma.galleryImage.findMany({
      where: { galleryId },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: newImages,
      message: `${createdImages.count} images added to gallery successfully`
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding images to gallery:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to add images to gallery'
    }, { status: 500 });
  }
} 