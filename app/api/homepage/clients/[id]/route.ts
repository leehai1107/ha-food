import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, logoUrl, websiteUrl, description, position, isActive } = await req.json();

    // TODO: Add authentication/authorization check for admin here

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name,
        logoUrl,
        websiteUrl,
        description,
        position,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Client updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Client not found',
        message: `Client with ID ${params.id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update client'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Add authentication/authorization check for admin here

    const client = await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Client deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Client not found',
        message: `Client with ID ${params.id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete client'
    }, { status: 500 });
  }
}