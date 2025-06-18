import { NextResponse } from 'next/server';
import { ghnService } from '@/services/ghnService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fromDistrictId = searchParams.get('from_district_id');
    const toDistrictId = searchParams.get('to_district_id');

    if (!fromDistrictId || !toDistrictId) {
        return NextResponse.json(
            { error: 'Both from_district_id and to_district_id are required' },
            { status: 400 }
        );
    }

    try {
        const services = await ghnService.getServices(
            parseInt(fromDistrictId),
            parseInt(toDistrictId)
        );
        return NextResponse.json({
            code: 200,
            message: 'Success',
            data: services
        });
    } catch (error) {
        console.error('Error in services API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch services data' },
            { status: 500 }
        );
    }
} 