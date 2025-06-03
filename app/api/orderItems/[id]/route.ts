import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const orderItem = await prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: {
          include: {
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
            currentPrice: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });

    if (!orderItem) {
      return NextResponse.json({
        success: false,
        error: 'Order item not found',
        message: `Order item with ID ${id} does not exist`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: orderItem,
      message: 'Order item retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch order item'
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const { quantity, productPrice } = await req.json();

    if (!quantity || quantity <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Quantity must be a positive number'
      }, { status: 400 });
    }

    // Get current order item and order
    const currentItem = await prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true
      }
    });

    if (!currentItem) {
      return NextResponse.json({
        success: false,
        error: 'Order item not found',
        message: `Order item with ID ${id} does not exist`
      }, { status: 404 });
    }

    // Only allow updates for pending orders
    if (currentItem.order.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Invalid operation',
        message: 'Can only update items in pending orders'
      }, { status: 400 });
    }

    // Check product availability and stock
    if (currentItem.product && !currentItem.product.available) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Product is not available'
      }, { status: 400 });
    }

    const quantityDiff = quantity - currentItem.quantity;

    if (currentItem.product && quantityDiff > 0) {
      if (currentItem.product.quantity < quantityDiff) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: `Insufficient stock. Available: ${currentItem.product.quantity}, Additional needed: ${quantityDiff}`
        }, { status: 400 });
      }
    }

    // Update order item and product quantity in transaction
    const updatedItem = await prisma.$transaction(async (tx) => {
      // Update product quantity
      if (currentItem.product && quantityDiff !== 0) {
        await tx.product.update({
          where: { productSku: currentItem.productSku! },
          data: {
            quantity: {
              increment: -quantityDiff // Negative diff means adding back to stock
            }
          }
        });
      }

      // Calculate new total price
      const newPrice = productPrice || currentItem.productPrice;
      const newTotalPrice = newPrice * quantity;

      // Update order item
      const updatedOrderItem = await tx.orderItem.update({
        where: { id },
        data: {
          quantity,
          productPrice: newPrice,
          totalPrice: newTotalPrice
        },
        include: {
          order: true,
          product: {
            select: {
              productSku: true,
              productName: true,
              available: true,
              currentPrice: true
            }
          }
        }
      });

      // Recalculate order total
      const orderTotal = await tx.orderItem.aggregate({
        where: { orderId: currentItem.orderId },
        _sum: { totalPrice: true }
      });

      await tx.order.update({
        where: { id: currentItem.orderId },
        data: { totalPrice: orderTotal._sum.totalPrice || 0 }
      });

      return updatedOrderItem;
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Order item updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Order item not found',
        message: `Order item with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update order item'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    // Get current order item and order
    const currentItem = await prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true
      }
    });

    if (!currentItem) {
      return NextResponse.json({
        success: false,
        error: 'Order item not found',
        message: `Order item with ID ${id} does not exist`
      }, { status: 404 });
    }

    // Only allow deletion for pending orders
    if (currentItem.order.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Invalid operation',
        message: 'Can only delete items from pending orders'
      }, { status: 400 });
    }

    // Check if this is the last item in the order
    const itemCount = await prisma.orderItem.count({
      where: { orderId: currentItem.orderId }
    });

    if (itemCount === 1) {
      return NextResponse.json({
        success: false,
        error: 'Invalid operation',
        message: 'Cannot delete the last item from an order. Delete the order instead.'
      }, { status: 400 });
    }

    // Delete order item and restore product quantity in transaction
    const deletedItem = await prisma.$transaction(async (tx) => {
      // Restore product quantity
      if (currentItem.product) {
        await tx.product.update({
          where: { productSku: currentItem.productSku! },
          data: {
            quantity: {
              increment: currentItem.quantity
            }
          }
        });
      }

      // Delete order item
      const deleted = await tx.orderItem.delete({
        where: { id },
        include: {
          order: true,
          product: {
            select: {
              productSku: true,
              productName: true
            }
          }
        }
      });

      // Recalculate order total
      const orderTotal = await tx.orderItem.aggregate({
        where: { orderId: currentItem.orderId },
        _sum: { totalPrice: true }
      });

      await tx.order.update({
        where: { id: currentItem.orderId },
        data: { totalPrice: orderTotal._sum.totalPrice || 0 }
      });

      return deleted;
    });

    return NextResponse.json({
      success: true,
      data: deletedItem,
      message: 'Order item deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Order item not found',
        message: `Order item with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete order item'
    }, { status: 500 });
  }
}