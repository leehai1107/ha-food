import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const sku = (await params).sku;
    const product = await prisma.product.findUnique({
      where: { productSku: sku },
      include: {
        category: { select: { id: true, name: true } },
        images: true
      }
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product'
    }, { status: 500 });
  }
}

// You can add PUT and DELETE here as needed, following your Express logic.