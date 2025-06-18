import { NextResponse } from 'next/server';
import { ghnService, ShippingFeeRequest } from '@/services/ghnService';

export async function POST(request: Request) {
    try {
        const body: ShippingFeeRequest = await request.json();
        
        // Validate required fields
        const requiredFields = ['service_id', 'to_district_id', 'to_ward_code', 'height', 'length', 'weight', 'width'];
        for (const field of requiredFields) {
            if (!body[field as keyof ShippingFeeRequest]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const shippingFee = await ghnService.calculateShippingFee(body);
        return NextResponse.json({
            code: 200,
            message: 'Success',
            data: shippingFee
        });
    } catch (error) {
        console.error('Error in shipping fee API:', error);
        return NextResponse.json(
            { error: 'Không thể tính phí vận chuyển' },
            { status: 500 }
        );
    }
} 