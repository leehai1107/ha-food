import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Status is required'
      }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      }, { status: 400 });
    }

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });

    if (!currentOrder) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${id} does not exist`
      }, { status: 404 });
    }

    // Handle inventory restoration if order is being cancelled
    const order = await prisma.$transaction(async (tx) => {
      if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
        // Restore product quantities
        for (const item of currentOrder.orderItems) {
          await tx.product.update({
            where: { productSku: item.productSku! },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          });
        }
      }

      // Update order status
      return tx.order.update({
        where: { id },
        data: { status },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  productSku: true,
                  productName: true,
                  available: true
                }
              }
            }
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update order status'
    }, { status: 500 });
  }
}