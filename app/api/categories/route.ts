import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const flat = searchParams.get('flat') === 'true';

    if (flat) {
      const categories = await prisma.category.findMany({
        include: {
          parent: true,
          _count: { select: { children: true, products: true } },
          ...(includeProducts && {
            products: {
              select: {
                productSku: true,
                productName: true,
                currentPrice: true,
                available: true
              }
            }
          })
        },
        orderBy: { name: 'asc' }
      });
      return NextResponse.json({
        success: true,
        data: categories,
        message: 'Categories retrieved successfully'
      });
    }

    // Hierarchical
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { children: true, products: true } },
            ...(includeProducts && {
              products: {
                select: {
                  productSku: true,
                  productName: true,
                  currentPrice: true,
                  available: true
                }
              }
            })
          }
        },
        _count: { select: { children: true, products: true } },
        ...(includeProducts && {
          products: {
            select: {
              productSku: true,
              productName: true,
              currentPrice: true,
              available: true
            }
          }
        })
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch categories'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, imageUrl, parentId } = await req.json();

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Category name is required'
      }, { status: 400 });
    }

    // Validate parent category exists if parentId is provided
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
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        parentId: parentId || null
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
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create category'
    }, { status: 500 });
  }
}