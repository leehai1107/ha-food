import { NextResponse } from 'next/server';
import { ghnService } from '@/services/ghnService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('district_id');

    if (!districtId) {
        return NextResponse.json(
            { error: 'District ID is required' },
            { status: 400 }
        );
    }

    try {
        const wards = await ghnService.getWards(parseInt(districtId));
        return NextResponse.json({
            code: 200,
            message: 'Success',
            data: wards
        });
    } catch (error) {
        console.error('Error in wards API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wards data' },
            { status: 500 }
        );
    }
} 