import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({ select: { tags: true } });
    const allTags = products.flatMap((p: { tags: string[] }) => p.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    return NextResponse.json({
      success: true,
      data: uniqueTags,
      message: 'Product tags retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product tags'
    }, { status: 500 });
  }
} 