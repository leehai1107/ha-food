import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const id = parseInt(params.id);

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: { select: { products: true } }
          }
        },
        _count: { select: { children: true, products: true } },
        ...(includeProducts && {
          products: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        })
      }
    });

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch category'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { name, description, imageUrl, parentId } = await req.json();

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Category name is required'
      }, { status: 400 });
    }

    if (parentId && id === parentId) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Category cannot be its own parent'
      }, { status: 400 });
    }

    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });
      if (!parentCategory) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Parent category does not exist'
        }, { status: 400 });
      }
      // Check for circular reference (simplified)
      const descendants = await prisma.category.findMany({
        where: { parentId: id }
      });
      if (descendants.some(desc => desc.id === parentId)) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Cannot create circular reference in category hierarchy'
        }, { status: 400 });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        parentId: parentId || null
      },
      include: {
        parent: true,
        children: true,
        _count: { select: { children: true, products: true } }
      }
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Category not found',
        message: `Category with ID ${params.id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update category'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: id }
    });
    if (childrenCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Constraint violation',
        message: `Cannot delete category. ${childrenCount} subcategories depend on this category.`
      }, { status: 400 });
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });
    if (productsCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Constraint violation',
        message: `Cannot delete category. ${productsCount} products are assigned to this category.`
      }, { status: 400 });
    }

    const category = await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Category not found',
        message: `Category with ID ${params.id} does not exist`
      }, { status: 404 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete category'
    }, { status: 500 });
  }
}