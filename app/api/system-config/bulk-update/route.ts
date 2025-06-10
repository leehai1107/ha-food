import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { configs } = body;

    if (!Array.isArray(configs)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data format',
          message: 'Configs must be an array'
        },
        { status: 400 }
      );
    }

    const updatePromises = configs.map(({ key, value }: { key: string; value: string }) =>
      prisma.systemConfig.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          type: 'text', // Default type, should be specified properly
          category: 'general', // Default category
          label: key,
          isActive: true
        }
      })
    );

    const updatedConfigs = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      data: updatedConfigs,
      message: 'Configurations updated successfully'
    });
  } catch (error) {
    console.error('Error bulk updating configs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update configurations'
      },
      { status: 500 }
    );
  }
}
