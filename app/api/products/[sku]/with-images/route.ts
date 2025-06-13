import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

async function ensureDirSync(dir: string) {
  try {
    await writeFile(path.join(dir, '.keep'), '');
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ sku: string }> }) {
  try {
    const sku = (await params).sku;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { productSku: sku },
      include: { images: true }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Not Found',
        message: 'Product not found'
      }, { status: 404 });
    }

    // Parse form data
    const formData = await req.formData();
    const productSku = formData.get('productSku') as string;
    const productName = formData.get('productName') as string;
    const slug = formData.get('slug') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const productType = formData.get('productType') as string;
    const originalPrice = parseFloat(formData.get('originalPrice') as string);
    const currentPrice = parseFloat(formData.get('currentPrice') as string);
    const productDescriptions = formData.get('productDescriptions') as string;
    const productContent = formData.get('productContent') as string;
    const productPreserve = formData.get('productPreserve') as string;
    const available = formData.get('available') === 'true';
    const weight = formData.get('weight') as string;
    const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const productIngredients = JSON.parse(formData.get('productIngredients') as string || '[]');
    const images = formData.getAll('images') as File[];

    // Validate required fields
    if (!productName || !productType || !productSku) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Product name, type, and SKU are required'
      }, { status: 400 });
    }

    // Validate category exists if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          message: 'Category does not exist'
        }, { status: 400 });
      }
    }

    // Handle image uploads if provided
    let uploadedImages: { imageUrl: string; isPrimary: boolean; position: number }[] = [];
    if (images.length > 0) {
      await ensureDirSync(uploadDir);

      // Delete old images if they exist
      for (const oldImage of existingProduct.images) {
        const oldImagePath = path.join(process.cwd(), 'public', oldImage.imageUrl);
        try {
          await writeFile(oldImagePath, '');
        } catch (error) {
          // Ignore error if file doesn't exist
        }
      }

      // Delete old images from database
      await prisma.productImage.deleteMany({
        where: { productSku: sku }
      });

      // Upload new images
      uploadedImages = await Promise.all(
        images.map(async (file, index) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${Date.now()}-${index}-${file.name}`;
          const newImagePath = path.join(uploadDir, filename);
          
          await writeFile(newImagePath, buffer);
          return {
            imageUrl: `/uploads/products/${filename}`,
            isPrimary: index === 0, // First image is primary
            position: index
          };
        })
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { productSku: sku },
      data: {
        productName,
        slug,
        quantity,
        productType,
        originalPrice,
        currentPrice,
        tags,
        productDescriptions,
        productIngredients,
        productContent,
        productPreserve,
        available,
        weight,
        categoryId,
        ...(uploadedImages.length > 0 && {
          images: {
            create: uploadedImages
          }
        })
      },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }] }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'Failed to update product'
    }, { status: 500 });
  }
}
