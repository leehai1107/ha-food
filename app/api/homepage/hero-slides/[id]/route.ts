import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { title, subtitle, ctaText, ctaLink, imageUrl, position, isActive } = await req.json();

    // TODO: Add authentication/authorization check for admin here

    const slide = await prisma.heroSlide.update({
      where: { id: parseInt(id) },
      data: {
        title,
        subtitle,
        ctaText,
        ctaLink,
        imageUrl,
        position,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: slide,
      message: 'Hero slide updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Hero slide not found',
        message: `Hero slide with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update hero slide'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    // TODO: Add authentication/authorization check for admin here

    const slide = await prisma.heroSlide.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      data: slide,
      message: 'Hero slide deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Hero slide not found',
        message: `Hero slide with ID ${(await params).id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete hero slide'
    }, { status: 500 });
  }
}