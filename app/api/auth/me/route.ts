import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated'
      }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        role: true,
        orders: {
          include: { orderItems: true },
          orderBy: { createdAt: 'desc' },
          take: 5 // Last 5 orders
        }
      }
    });

    if (!account) {
      return NextResponse.json({
        success: false,
        error: 'Account not found',
        message: 'Account does not exist'
      }, { status: 404 });
    }

    // Remove password hash from response
    const { passwordHash, ...safeAccount } = account;

    return NextResponse.json({
      success: true,
      data: safeAccount,
      message: 'Account information retrieved successfully'
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve account information'
    }, { status: 500 });
  }
}
