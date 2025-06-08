import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const productTypes = await prisma.product.findMany({
      select: { productType: true },
      distinct: ['productType'],
      orderBy: { productType: 'asc' }
    });
    const types = productTypes.map(p => p.productType);
    return NextResponse.json({
      success: true,
      data: types,
      message: 'Product types retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product types'
    }, { status: 500 });
  }
} 