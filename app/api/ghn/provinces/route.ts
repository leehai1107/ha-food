import { NextResponse } from 'next/server';
import { ghnService } from '@/services/ghnService';

export async function GET() {
    try {
        const provinces = await ghnService.getProvinces();
        return NextResponse.json({
            code: 200,
            message: 'Success',
            data: provinces
        });
    } catch (error) {
        console.error('Error in provinces API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch provinces data' },
            { status: 500 }
        );
    }
} 