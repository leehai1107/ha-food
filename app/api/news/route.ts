import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(req.url);

    // /api/news/tags/all
    if (pathname.endsWith('/tags/all')) {
      const news = await prisma.news.findMany({
        where: { isPublished: true },
        select: { tags: true }
      });
      const allTags = news.flatMap(n => n.tags);
      const uniqueTags = [...new Set(allTags)].sort();
      return NextResponse.json({
        success: true,
        data: uniqueTags,
        message: 'Tags retrieved successfully'
      });
    }

    // /api/news (public)
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
      publishedAt: { lte: new Date() }
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (tag) {
      where.tags = { has: tag };
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { author: { select: { id: true, name: true } } }
      }),
      prisma.news.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: { news, total, page, limit, totalPages },
      message: 'News retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch news'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication/authorization for admin
    const { title, excerpt, content, featuredImage, tags, isPublished, publishedAt, authorId } = await req.json();

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Title and content are required'
      }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.news.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newsData: any = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags: tags || [],
      authorId,
      isPublished: isPublished || false
    };

    if (isPublished && publishedAt) {
      newsData.publishedAt = new Date(publishedAt);
    } else if (isPublished) {
      newsData.publishedAt = new Date();
    }

    const news = await prisma.news.create({
      data: newsData,
      include: { author: { select: { id: true, name: true } } }
    });

    return NextResponse.json({
      success: true,
      data: news,
      message: 'News created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create news'
    }, { status: 500 });
  }
}