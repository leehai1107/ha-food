import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/galleries/tags - Get all unique gallery tags
export async function GET(req: NextRequest) {
  try {
    // Get all galleries with tags
    const galleries = await prisma.gallery.findMany({
      where: {
        isActive: true
      },
      select: {
        tags: true
      }
    });

    // Extract all tags and remove duplicates
    const allTags = galleries
      .flatMap(gallery => gallery.tags)
      .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
      .sort(); // Sort alphabetically

    return NextResponse.json({
      success: true,
      data: {
        tags: allTags
      },
      message: 'Gallery tags retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching gallery tags:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch gallery tags'
    }, { status: 500 });
  }
} 