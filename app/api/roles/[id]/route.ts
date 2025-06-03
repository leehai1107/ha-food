import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        accounts: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Role not found',
          message: `Role with ID ${id} does not exist`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
      message: 'Role retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch role'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Role name is required'
        },
        { status: 400 }
      );
    }

    const role = await prisma.role.update({
      where: { id },
      data: { name }
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: 'Role updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Role not found',
          message: `Role with ID ${(await params).id} does not exist`
        },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Conflict',
          message: 'Role name already exists'
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update role'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);

    // Check if role has associated accounts
    const accountCount = await prisma.account.count({
      where: { roleId: id }
    });

    if (accountCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Constraint violation',
          message: `Cannot delete role. ${accountCount} accounts are associated with this role.`
        },
        { status: 400 }
      );
    }

    const role = await prisma.role.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      data: role,
      message: 'Role deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Role not found',
          message: `Role with ID ${(await params).id} does not exist`
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete role'
      },
      { status: 500 }
    );
  }
}