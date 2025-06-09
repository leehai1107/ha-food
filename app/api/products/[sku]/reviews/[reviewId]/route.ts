import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/products/[sku]/reviews/[reviewId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string; reviewId: string }> }
) {
  try {
    const { sku, reviewId } = await params;
    const reviewData = await req.json();
    const reviewIdNum = parseInt(reviewId);

    // Validate review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewIdNum }
    });

    if (!existingReview) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Review not found'
      }, { status: 404 });
    }

    // Update review
    const review = await prisma.review.update({
      where: { id: reviewIdNum },
      data: {
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
      message: 'Review updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update review'
    }, { status: 500 });
  }
}

// DELETE /api/products/[sku]/reviews/[reviewId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string; reviewId: string }> }
) {
  try {
    const { sku, reviewId } = await params;
    const reviewIdNum = parseInt(reviewId);

    // Validate review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewIdNum }
    });

    if (!existingReview) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Review not found'
      }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewIdNum }
    });

    // Update product rating
    const productReviews = await prisma.review.findMany({
      where: { productSku: sku }
    });

    const averageRating = productReviews.length > 0
      ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length
      : null;

    await prisma.product.update({
      where: { productSku: sku },
      data: {
        rating: averageRating,
        reviewCount: productReviews.length
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete review'
    }, { status: 500 });
  }
} 