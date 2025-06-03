import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id);
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        role: true,
        orders: {
          include: { orderItems: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!account) {
      return NextResponse.json({
        success: false,
        error: 'Account not found',
        message: `Account with ID ${id} does not exist`
      }, { status: 404 });
    }

    // Remove password hash from response
    const { passwordHash, ...safeAccount } = account;

    return NextResponse.json({
      success: true,
      data: safeAccount,
      message: 'Account retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch account'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id);
    const body = await req.json();
    const { name, email, password, phone, address, roleId } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (roleId) updateData.roleId = roleId;

    // Hash new password if provided
    if (password) {
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Invalid email format'
        }, { status: 400 });
      }
    }

    const account = await prisma.account.update({
      where: { id },
      data: updateData,
      include: { role: true }
    });

    const { passwordHash, ...safeAccount } = account;

    return NextResponse.json({
      success: true,
      data: safeAccount,
      message: 'Account updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Account not found',
        message: `Account with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
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
      message: 'Failed to update account'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id);

    const account = await prisma.account.delete({
      where: { id },
      include: { role: true }
    });

    const { passwordHash, ...safeAccount } = account;

    return NextResponse.json({
      success: true,
      data: safeAccount,
      message: 'Account deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Account not found',
        message: `Account with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete account'
    }, { status: 500 });
  }
}