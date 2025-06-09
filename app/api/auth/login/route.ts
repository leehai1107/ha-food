import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Email and password are required'
      }, { status: 400 });
    }
    const account = await prisma.account.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true }
    });
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      }, { status: 401 });
    }
    const accessToken = generateToken(account);
    const refreshToken = generateRefreshToken(account);
    const { passwordHash, ...safeAccount } = account;
    return NextResponse.json({
      success: true,
      data: { account: safeAccount, accessToken, refreshToken },
      message: 'Login successful'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process login'
    }, { status: 500 });
  }
} 