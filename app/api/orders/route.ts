import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import emailService from '@/services/emailService';
// import emailService from '@/services/emailService'; // Uncomment and adjust path if you have email service

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(req.url);

    // /api/orders/stats/summary
    if (pathname.endsWith('/stats/summary')) {
      const startDate = searchParams.get('startDate') || undefined;
      const endDate = searchParams.get('endDate') || undefined;

      const where: any = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [
        totalOrders,
        pendingOrders,
        paidOrders,
        shippedOrders,
        cancelledOrders,
        totalRevenue
      ] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.count({ where: { ...where, status: 'pending' } }),
        prisma.order.count({ where: { ...where, status: 'paid' } }),
        prisma.order.count({ where: { ...where, status: 'shipped' } }),
        prisma.order.count({ where: { ...where, status: 'cancelled' } }),
        prisma.order.aggregate({
          where: { ...where, status: { not: 'cancelled' } },
          _sum: { totalPrice: true }
        })
      ]);

      return NextResponse.json({
        success: true,
        data: {
          totalOrders,
          pendingOrders,
          paidOrders,
          shippedOrders,
          cancelledOrders,
          totalRevenue: totalRevenue._sum.totalPrice || 0
        },
        message: 'Order statistics retrieved successfully'
      });
    }

    // /api/orders (main list)
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;
    const accountId = searchParams.get('accountId') ? parseInt(searchParams.get('accountId')!) : undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (accountId) where.accountId = accountId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true, email: true } },
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
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: 'Orders retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { accountId, status, orderItems, customerName, customerEmail, customerPhone, customerAddress } = await req.json();

    // Validate required fields
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Order items are required'
      }, { status: 400 });
    }

    // For guest orders, require customer information
    if (!accountId && (!customerName || !customerEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Customer name and email are required for guest orders'
      }, { status: 400 });
    }

    // Validate email format if provided
    if (customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Invalid email format'
        }, { status: 400 });
      }
    }

    // Validate account exists if provided
    if (accountId) {
      const account = await prisma.account.findUnique({ where: { id: accountId } });
      if (!account) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Account does not exist'
        }, { status: 400 });
      }
    }

    // Validate and prepare order items
    let totalPrice = 0;
    const validatedItems: any[] = [];

    for (const item of orderItems) {
      if (!item.productSku || !item.quantity || item.quantity <= 0) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Each order item must have productSku and positive quantity'
        }, { status: 400 });
      }

      // Get product details
      const product = await prisma.product.findUnique({
        where: { productSku: item.productSku }
      });

      if (!product) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: `Product with SKU ${item.productSku} does not exist`
        }, { status: 400 });
      }

      if (!product.available) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: `Product ${product.productName} is not available`
        }, { status: 400 });
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: `Insufficient stock for ${product.productName}. Available: ${product.quantity}, Requested: ${item.quantity}`
        }, { status: 400 });
      }

      const itemPrice = item.productPrice || product.currentPrice;
      const itemTotal = itemPrice * item.quantity;
      totalPrice += Number(itemTotal);

      validatedItems.push({
        productSku: item.productSku,
        productName: product.productName,
        productType: product.productType,
        productPrice: itemPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        tags: product.tags,
        productDescriptions: product.productDescriptions,
        productIngredients: product.productIngredients,
        productContent: product.productContent,
        productPreserve: product.productPreserve,
        weight: product.weight
      });
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          accountId: accountId || null,
          status: status || 'pending',
          totalPrice,
          customerName: customerName || null,
          customerEmail: customerEmail || null,
          customerPhone: customerPhone || null,
          customerAddress: customerAddress || null
        }
      });

      // Create order items
      await tx.orderItem.createMany({
        data: validatedItems.map(item => ({
          orderId: newOrder.id,
          ...item
        }))
      });

      // Update product quantities
      for (const item of orderItems) {
        await tx.product.update({
          where: { productSku: item.productSku },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      // Return order with items
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          account: { select: { id: true, name: true, email: true } },
          orderItems: true
        }
      });
    });

    // Optionally send email notification to admin (async)
    if (order && (customerEmail || order.account?.email)) {
      const emailData = {
        orderId: order.id,
        customerName: customerName || order.account?.name || 'Unknown',
        customerEmail: customerEmail || order.account?.email || '',
        customerPhone: customerPhone || '',
        customerAddress: customerAddress || '',
        orderItems: validatedItems.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          productPrice: Number(item.productPrice),
          totalPrice: Number(item.totalPrice)
        })),
        totalPrice: Number(totalPrice),
        createdAt: new Date()
      };
    await emailService.sendOrderNotificationToAdmin(emailData).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create order'
    }, { status: 500 });
  }
}