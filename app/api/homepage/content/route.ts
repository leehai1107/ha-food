import {  NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      homepageContent,
      heroSlides,
      testimonials,
      clients,
      footerSections,
      sectionLayouts
    ] = await Promise.all([
      prisma.homepageContent.findMany({
        where: { isActive: true },
        orderBy: { section: 'asc' }
      }),
      prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      }),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      }),
      prisma.client.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      }),
      prisma.footerSection.findMany({
        where: { isActive: true },
        orderBy: { section: 'asc' }
      }),
      prisma.sectionLayout.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        content: homepageContent,
        heroSlides,
        testimonials,
        clients,
        footerSections,
        sectionLayouts
      },
      message: 'Homepage content retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch homepage content'
    }, { status: 500 });
  }
}