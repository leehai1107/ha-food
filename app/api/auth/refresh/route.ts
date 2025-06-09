import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Refresh token is required'
      }, { status: 400 });
    }
    const decoded = verifyToken(refreshToken);
    const account = await prisma.account.findUnique({
      where: { id: decoded.accountId },
      include: { role: true }
    });
    if (!account) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Account not found'
      }, { status: 401 });
    }
    const accessToken = generateToken(account);
    return NextResponse.json({
      success: true,
      data: { accessToken },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid refresh token'
    }, { status: 401 });
  }
} 