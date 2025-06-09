import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, address } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Name, email, and password are required'
      }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Invalid email format'
      }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }
    const existingAccount = await prisma.account.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (existingAccount) {
      return NextResponse.json({
        success: false,
        error: 'Conflict',
        message: 'Email already registered'
      }, { status: 409 });
    }
    let userRole = await prisma.role.findFirst({
      where: { name: { in: ['user', 'User', 'USER'] } }
    });
    if (!userRole) {
      userRole = await prisma.role.create({ data: { name: 'user' } });
    }
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const account = await prisma.account.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        address: address || null,
        roleId: userRole.id
      },
      include: { role: true }
    });
    const accessToken = generateToken(account);
    const refreshToken = generateRefreshToken(account);
    const { passwordHash: _, ...safeAccount } = account;
    return NextResponse.json({
      success: true,
      data: { account: safeAccount, accessToken, refreshToken },
      message: 'Registration successful'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process registration'
    }, { status: 500 });
  }
} 