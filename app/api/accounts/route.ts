import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const roleId = searchParams.get('roleId') ? parseInt(searchParams.get('roleId')!) : undefined;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (roleId) where.roleId = roleId;

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
          _count: { select: { orders: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.account.count({ where })
    ]);

    const safeAccounts = accounts.map(({ passwordHash, ...account }) => account);

    return NextResponse.json({
      success: true,
      data: {
        accounts: safeAccounts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: 'Accounts retrieved successfully'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch accounts'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, address, roleId } = body;

    const requiredFields = ['name', 'email', 'password', 'roleId'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: `Missing required fields: ${missingFields.join(', ')}`
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

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const account = await prisma.account.create({
      data: { name, email, passwordHash, phone, address, roleId },
      include: { role: true }
    });

    const { passwordHash: _, ...safeAccount } = account;

    return NextResponse.json({
      success: true,
      data: safeAccount,
      message: 'Account created successfully'
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Conflict',
        message: 'Email already exists'
      }, { status: 409 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Invalid role ID'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create account'
    }, { status: 500 });
  }
}
