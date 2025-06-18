import { NextResponse } from 'next/server';
import { ghnService } from '@/services/ghnService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('province_id');

    if (!provinceId) {
        return NextResponse.json(
            { error: 'Province ID is required' },
            { status: 400 }
        );
    }

    try {
        const districts = await ghnService.getDistricts(parseInt(provinceId));
        return NextResponse.json({
            code: 200,
            message: 'Success',
            data: districts
        });
    } catch (error) {
        console.error('Error in districts API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch districts data' },
            { status: 500 }
        );
    }
} 