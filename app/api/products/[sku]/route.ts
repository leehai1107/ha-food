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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const sku = (await params).sku;
    const productData = await req.json();

    // Validate product exists
    const existingProduct = await prisma.product.findUnique({
      where: { productSku: sku }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      }, { status: 404 });
    }

    // Validate category exists if provided
    if (productData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId }
      });
      if (!category) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Category does not exist'
        }, { status: 400 });
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { productSku: sku },
      data: {
        productName: productData.productName,
        quantity: productData.quantity,
        productType: productData.productType,
        originalPrice: productData.originalPrice,
        currentPrice: productData.currentPrice,
        tags: productData.tags,
        productDescriptions: productData.productDescriptions,
        productIngredients: productData.productIngredients,
        productContent: productData.productContent,
        productPreserve: productData.productPreserve,
        available: productData.available,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        weight: productData.weight,
        categoryId: productData.categoryId
      },
      include: {
        category: { select: { id: true, name: true } },
        images: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Invalid category ID'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update product'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const sku = (await params).sku;

    // Validate product exists
    const existingProduct = await prisma.product.findUnique({
      where: { productSku: sku }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      }, { status: 404 });
    }

    // Delete product
    await prisma.product.delete({
      where: { productSku: sku }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete product'
    }, { status: 500 });
  }
}