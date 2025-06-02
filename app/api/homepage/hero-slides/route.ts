import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: slides,
      message: 'Hero slides retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch hero slides'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, subtitle, ctaText, ctaLink, imageUrl, position, isActive } = await req.json();

    if (!title || !subtitle || !ctaText || !imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Title, subtitle, CTA text, and image URL are required'
      }, { status: 400 });
    }

    // TODO: Add authentication/authorization check for admin here

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        subtitle,
        ctaText,
        ctaLink,
        imageUrl,
        position: position || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({
      success: true,
      data: slide,
      message: 'Hero slide created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create hero slide'
    }, { status: 500 });
  }
}