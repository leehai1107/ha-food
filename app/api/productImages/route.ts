import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productSku = searchParams.get('productSku') || undefined;
    const isPrimary = searchParams.has('isPrimary') ? searchParams.get('isPrimary') === 'true' : undefined;

    const where: any = {};
    if (productSku) where.productSku = productSku;
    if (isPrimary !== undefined) where.isPrimary = isPrimary;

    const images = await prisma.productImage.findMany({
      where,
      include: {
        product: {
          select: {
            productSku: true,
            productName: true
          }
        }
      },
      orderBy: [
        { isPrimary: 'desc' },
        { position: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: images,
      message: 'Product images retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product images'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);

    // /api/productImages/bulk
    if (pathname.endsWith('/bulk')) {
      const { productSku, images } = await req.json();

      if (!productSku || !Array.isArray(images) || images.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Product SKU and images array are required'
        }, { status: 400 });
      }

      // Validate product exists
      const product = await prisma.product.findUnique({ where: { productSku } });
      if (!product) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Product does not exist'
        }, { status: 400 });
      }

      for (const img of images) {
        if (!img.imageUrl) {
          return NextResponse.json({
            success: false,
            error: 'Validation error',
            message: 'Each image must have an imageUrl'
          }, { status: 400 });
        }
      }

      // If any image is marked as primary, unset existing primary images
      const hasPrimary = images.some(img => img.isPrimary);
      if (hasPrimary) {
        await prisma.productImage.updateMany({
          where: { productSku, isPrimary: true },
          data: { isPrimary: false }
        });
      }

      const createdImages = await Promise.all(
        images.map((img, index) =>
          prisma.productImage.create({
            data: {
              productSku,
              imageUrl: img.imageUrl,
              isPrimary: img.isPrimary || false,
              position: img.position !== undefined ? img.position : index
            },
            include: {
              product: {
                select: {
                  productSku: true,
                  productName: true
                }
              }
            }
          })
        )
      );

      return NextResponse.json({
        success: true,
        data: createdImages,
        message: 'Product images created successfully'
      }, { status: 201 });
    }

    // /api/productImages (single create)
    const { productSku, imageUrl, isPrimary, position } = await req.json();

    if (!productSku || !imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Product SKU and image URL are required'
      }, { status: 400 });
    }

    // Validate product exists
    const product = await prisma.product.findUnique({ where: { productSku } });
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Product does not exist'
      }, { status: 400 });
    }

    // If setting as primary, unset other primary images for this product
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productSku, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    const image = await prisma.productImage.create({
      data: {
        productSku,
        imageUrl,
        isPrimary: isPrimary || false,
        position: position || 0
      },
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
      message: 'Product image created successfully'
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Invalid product SKU'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create product image'
    }, { status: 500 });
  }
}