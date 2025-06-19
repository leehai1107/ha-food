import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // /api/products (main list)
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const productType = searchParams.get('productType') || undefined;
    const available = searchParams.has('available') ? searchParams.get('available') === 'true' : undefined;
    const minPrice = searchParams.has('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const tags = searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined;
    const sortBy = (searchParams.get('sortBy') as 'name' | 'price' | 'createdAt' | 'rating') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const categoryId = searchParams.has('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { productDescriptions: { contains: search, mode: 'insensitive' } },
        { productSku: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (productType) where.productType = productType;
    if (available !== undefined) where.available = available;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.currentPrice = {};
      if (minPrice !== undefined) where.currentPrice.gte = minPrice;
      if (maxPrice !== undefined) where.currentPrice.lte = maxPrice;
    }
    if (tags && tags.length > 0) where.tags = { hasEvery: tags };
    if (categoryId !== undefined) where.categoryId = categoryId;
    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'name':
        orderBy = { productName: sortOrder };
        break;
      case 'price':
        orderBy = { currentPrice: sortOrder };
        break;
      case 'rating':
        orderBy = { rating: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] },
          _count: { select: { orderItems: true } }
        },
        orderBy
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch products'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const productData = await req.json();

    // Validate required fields
    const requiredFields = [
      'productSku', 'productName', 'quantity', 'productType',
      'originalPrice', 'currentPrice', 'productDescriptions',
      'productIngredients', 'productContent', 'productPreserve'
    ];
    const missingFields = requiredFields.filter(field => !productData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate category exists if provided
    if (productData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId }
      });
      if (!category) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Category does not exist'
        }, { status: 400 });
      }
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        productSku: productData.productSku,
        productName: productData.productName,
        quantity: productData.quantity,
        productType: productData.productType,
        originalPrice: productData.originalPrice,
        currentPrice: productData.currentPrice,
        tags: productData.tags || [],
        productDescriptions: productData.productDescriptions,
        productIngredients: productData.productIngredients || [],
        productContent: productData.productContent,
        productPreserve: productData.productPreserve,
        available: productData.available ?? true,
        rating: productData.rating,
        reviewCount: productData.reviewCount ?? 0,
        weight: productData.weight,
        categoryId: productData.categoryId
      },
      include: {
        category: { select: { id: true, name: true } },
        images: true
      }
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'Conflict',
        message: `Product with SKU ${error.meta?.target?.[0] || ''} already exists`
      }, { status: 409 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Invalid category ID'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create product'
    }, { status: 500 });
  }
}