import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { isPublished: true },
      select: { tags: true }
    });

    const allTags = news.flatMap((n: { tags: string[] }) => n.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    return NextResponse.json({
      success: true,
      data: uniqueTags,
      message: 'Tags retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch tags'
      },
      { status: 500 }
    );
  }
}
