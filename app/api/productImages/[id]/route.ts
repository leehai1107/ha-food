import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const image = await prisma.productImage.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            productSku: true,
            productName: true
          }
        }
      }
    });

    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'Product image not found',
        message: `Product image with ID ${id} does not exist`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: image,
      message: 'Product image retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product image'
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const { imageUrl, isPrimary, position } = await req.json();

    const updateData: any = {};
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (isPrimary !== undefined) updateData.isPrimary = isPrimary;
    if (position !== undefined) updateData.position = position;

    // Get current image to check product SKU
    const currentImage = await prisma.productImage.findUnique({ where: { id } });
    if (!currentImage) {
      return NextResponse.json({
        success: false,
        error: 'Product image not found',
        message: `Product image with ID ${id} does not exist`
      }, { status: 404 });
    }

    // If setting as primary, unset other primary images for this product
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productSku: currentImage.productSku,
          isPrimary: true,
          id: { not: id }
        },
        data: { isPrimary: false }
      });
    }

    const image = await prisma.productImage.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            productSku: true,
            productName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: image,
      message: 'Product image updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Product image not found',
        message: `Product image with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update product image'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    const image = await prisma.productImage.delete({
      where: { id },
      include: {
        product: {
          select: {
            productSku: true,
            productName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: image,
      message: 'Product image deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Product image not found',
        message: `Product image with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete product image'
    }, { status: 500 });
  }
}