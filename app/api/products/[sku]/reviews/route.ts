import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products/[sku]/reviews
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const sku = (await params).sku;
    const reviews = await prisma.review.findMany({
      where: {
        productSku: sku
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      message: 'Reviews retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch reviews'
    }, { status: 500 });
  }
}

// POST /api/products/[sku]/reviews
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const sku = (await params).sku;
    const reviewData = await req.json();

    // Validate required fields
    const requiredFields = ['customerName', 'rating', 'content'];
    const missingFields = requiredFields.filter(field => !reviewData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { productSku: sku }
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Product not found'
      }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productSku: sku,
        customerName: reviewData.customerName,
        rating: reviewData.rating,
        content: reviewData.content
      }
    });

    // Update product rating
    const productReviews = await prisma.review.findMany({
      where: { productSku: sku }
    });

    const averageRating = productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length;

    await prisma.product.update({
      where: { productSku: sku },
      data: {
        rating: averageRating,
        reviewCount: productReviews.length
      }
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create review'
    }, { status: 500 });
  }
} 