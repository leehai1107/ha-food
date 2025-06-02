import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { accounts: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: roles,
      message: 'Roles retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch roles'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Role name is required'
      }, { status: 400 });
    }

    const role = await prisma.role.create({
      data: { name }
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: 'Role created successfully'
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Conflict',
        message: 'Role name already exists'
      }, { status: 409 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create role'
    }, { status: 500 });
  }
}