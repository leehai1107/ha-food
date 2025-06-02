import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId') ? parseInt(searchParams.get('orderId')!) : undefined;
    const productSku = searchParams.get('productSku') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (productSku) where.productSku = productSku;

    const [orderItems, total] = await Promise.all([
      prisma.orderItem.findMany({
        where,
        skip,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              account: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          product: {
            select: {
              productSku: true,
              productName: true,
              available: true,
              currentPrice: true
            }
          }
        },
        orderBy: { id: 'desc' }
      }),
      prisma.orderItem.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orderItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: 'Order items retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch order items'
    }, { status: 500 });
  }
}