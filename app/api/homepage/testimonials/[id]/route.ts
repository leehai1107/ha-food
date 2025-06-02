import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, location, type, content, avatarUrl, rating, position, isActive } = await req.json();

    // TODO: Add authentication/authorization check for admin here

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        type,
        content,
        avatarUrl,
        rating,
        position,
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Testimonial not found',
        message: `Testimonial with ID ${params.id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update testimonial'
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

    const testimonial = await prisma.testimonial.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Testimonial not found',
        message: `Testimonial with ID ${params.id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete testimonial'
    }, { status: 500 });
  }
}