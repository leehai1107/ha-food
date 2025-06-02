import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
      message: 'Testimonials retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch testimonials'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, location, type, content, avatarUrl, rating, position, isActive } = await req.json();

    if (!name || !location || !type || !content) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Name, location, type, and content are required'
      }, { status: 400 });
    }

    // TODO: Add authentication/authorization check for admin here

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        type,
        content,
        avatarUrl,
        rating: rating || 5,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create testimonial'
    }, { status: 500 });
  }
}