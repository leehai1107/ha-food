import { NextResponse } from 'next/server';
import { ghnService, ShippingFeeRequest } from '@/services/ghnService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const provinceId = searchParams.get('province_id');
    const districtId = searchParams.get('district_id');
    const fromDistrictId = searchParams.get('from_district_id');
    const toDistrictId = searchParams.get('to_district_id');

    try {
        let data;
        
        switch (type) {
            case 'provinces':
                data = await ghnService.getProvinces();
                break;
                
            case 'districts':
                if (!provinceId) {
                    return NextResponse.json(
                        { error: 'Province ID is required for districts' },
                        { status: 400 }
                    );
                }
                data = await ghnService.getDistricts(parseInt(provinceId));
                break;
                
            case 'wards':
                if (!districtId) {
                    return NextResponse.json(
                        { error: 'District ID is required for wards' },
                        { status: 400 }
                    );
                }
                data = await ghnService.getWards(parseInt(districtId));
                break;
                
            case 'services':
                if (!fromDistrictId || !toDistrictId) {
                    return NextResponse.json(
                        { error: 'Both from_district_id and to_district_id are required for services' },
                        { status: 400 }
                    );
                }
                data = await ghnService.getServices(
                    parseInt(fromDistrictId),
                    parseInt(toDistrictId)
                );
                break;
                
            default:
                return NextResponse.json(
                    { error: 'Invalid type. Use: provinces, districts, wards, or services' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            code: 200,
            message: 'Success',
            data: data
        });
    } catch (error: any) {
        console.error('Error in GHN API:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch GHN data',
                details: error.message,
                type: type
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type !== 'shipping-fee') {
        return NextResponse.json(
            { error: 'Invalid type. Use: shipping-fee' },
            { status: 400 }
        );
    }

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
        console.error('Error in shipping fee calculation:', error);
        return NextResponse.json(
            { error: 'Không thể tính phí vận chuyển' },
            { status: 500 }
        );
    }
} 