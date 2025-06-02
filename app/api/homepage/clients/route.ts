import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: clients,
      message: 'Clients retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch clients'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, logoUrl, websiteUrl, description, position, isActive } = await req.json();

    if (!name || !logoUrl) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Name and logo URL are required'
      }, { status: 400 });
    }

    // TODO: Add authentication/authorization check for admin here

    const client = await prisma.client.create({
      data: {
        name,
        logoUrl,
        websiteUrl,
        description,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Client created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create client'
    }, { status: 500 });
  }
}