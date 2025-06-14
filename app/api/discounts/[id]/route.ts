import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const id = (await params).id;
    const discount = await prisma.discount.update({
      where: {
        id: parseInt(id)
      },
      data: {
        minQuantity: body.minQuantity,
        discountPercent: body.discountPercent,
        isActive: body.isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update discount'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await prisma.discount.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting discount:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete discount'
    }, { status: 500 });
  }
} 