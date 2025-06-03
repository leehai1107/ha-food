import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                productSku: true,
                productName: true,
                available: true,
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
        message: `Order with ID ${id} does not exist`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch order'
    }, { status: 500 });
  }
}

export async function PUT(
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

    const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
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
      message: 'Order updated successfully'
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
      message: 'Failed to update order'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

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

    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(currentOrder.status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid operation',
        message: 'Only pending or cancelled orders can be deleted'
      }, { status: 400 });
    }

    // Delete order and restore inventory if needed
    const deletedOrder = await prisma.$transaction(async (tx) => {
      // Restore product quantities if order was not cancelled
      if (currentOrder.status === 'pending') {
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

      // Delete order (cascade will delete order items)
      return tx.order.delete({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          orderItems: true
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
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
      message: 'Failed to delete order'
    }, { status: 500 });
  }
}