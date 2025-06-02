import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const news = await prisma.news.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true } } }
    });

    if (
      !news ||
      !news.isPublished ||
      (news.publishedAt && news.publishedAt > new Date())
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'News not found',
          message: `News with slug '${slug}' not found`
        },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: { ...news, viewCount: news.viewCount + 1 },
      message: 'News retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch news'
      },
      { status: 500 }
    );
  }
}