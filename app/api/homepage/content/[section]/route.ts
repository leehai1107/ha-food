import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const { section } = params;

    const content = await prisma.homepageContent.findUnique({
      where: { section }
    });

    if (!content) {
      return NextResponse.json({
        success: false,
        error: 'Content not found',
        message: `Content for section '${section}' not found`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: content,
      message: 'Section content retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch section content'
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const { section } = params;
    const { title, subtitle, content, isActive } = await req.json();

    // TODO: Add authentication/authorization check for admin here

    const updatedContent = await prisma.homepageContent.upsert({
      where: { section },
      update: {
        title,
        subtitle,
        content,
        isActive: isActive !== undefined ? isActive : true
      },
      create: {
        section,
        title,
        subtitle,
        content,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: 'Section content updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update section content'
    }, { status: 500 });
  }
}