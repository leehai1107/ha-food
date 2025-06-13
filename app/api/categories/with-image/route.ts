import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories');

async function ensureDirSync(dir: string) {
  try {
    await writeFile(path.join(dir, '.keep'), '');
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const parentId = formData.get('parentId') as string;
    const file = formData.get('image') as File;

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Category name is required'
      }, { status: 400 });
    }

    // Validate parent category if provided
    if (parentId) {
      const parentIdNum = parseInt(parentId);
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentIdNum }
      });
      if (!parentCategory) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Parent category does not exist'
        }, { status: 400 });
      }
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (file) {
      await ensureDirSync(uploadDir);
      
      // Generate unique filename
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const newImagePath = path.join(uploadDir, filename);
      
      // Save new image
      await writeFile(newImagePath, buffer);
      imageUrl = `/uploads/categories/${filename}`;
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        imageUrl,
        parentId: parentId ? parseInt(parentId) : null
      },
      include: {
        parent: true,
        _count: { select: { children: true, products: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'Failed to create category'
    }, { status: 500 });
  }
}
