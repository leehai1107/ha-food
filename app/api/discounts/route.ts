import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: {
        minQuantity: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch discounts'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const discount = await prisma.discount.create({
      data: {
        minQuantity: body.minQuantity,
        discountPercent: body.discountPercent,
        isActive: body.isActive ?? true
      }
    });

    return NextResponse.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create discount'
    }, { status: 500 });
  }
} 