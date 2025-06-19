import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // all, published, draft
    const skip = (page - 1) * limit;

    // Build where clause based on status
    let where: any = {};
    if (status === 'published') {
      where.isPublished = true;
    } else if (status === 'draft') {
      where.isPublished = false;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, name: true } } }
      }),
      prisma.news.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: { news, total, page, limit, totalPages },
      message: 'Admin news retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch admin news'
    }, { status: 500 });
  }
} 