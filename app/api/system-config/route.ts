import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    const authorization = request.headers.get('authorization');

    const where: any = {};

    if (category) where.category = category;
    if (type) where.type = type;
    if (isActive !== null) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { label: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // For public access, only return active configs
    if (!authorization) {
      where.isActive = true;
    }

    const configs = await prisma.systemConfig.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: configs,
      message: 'System configurations retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching system configs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch system configurations'
      },
      { status: 500 }
    );
  }
}
