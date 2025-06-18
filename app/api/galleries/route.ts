import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

// GET /api/galleries - Get all galleries with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchParam = searchParams.get('search');
    const search = searchParam && searchParam !== 'undefined' && searchParam.trim() !== '' ? searchParam : undefined;
    const tags = searchParams.get('tags') || undefined;
    const isActive = searchParams.has('isActive') ? searchParams.get('isActive') === 'true' : undefined;
    const includeImages = searchParams.get('includeImages') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { hasSome: tagArray };
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Get galleries with count
    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          images: includeImages ? {
            orderBy: { position: 'asc' }
          } : false,
          _count: {
            select: { images: true }
          }
        },
        orderBy: [
          { isActive: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.gallery.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        galleries,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      },
      message: 'Galleries retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch galleries'
    }, { status: 500 });
  }
}

// POST /api/galleries - Create a new gallery
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, tags = [], isActive = true } = body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Gallery name is required'
      }, { status: 400 });
    }

    // Create gallery
    const gallery = await prisma.gallery.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        tags: Array.isArray(tags) ? tags : [],
        isActive
      },
      include: {
        _count: {
          select: { images: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: gallery,
      message: 'Gallery created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create gallery'
    }, { status: 500 });
  }
} 