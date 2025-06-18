import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const provinceId = searchParams.get('province_id');
    const districtId = searchParams.get('district_id');

    console.log('Fallback API called with type:', type);

    try {
        let data;
        
        switch (type) {
            case 'provinces':
                data = [
                    {
                        ProvinceID: 201,
                        ProvinceName: "Hà Nội",
                        Code: "4"
                    },
                    {
                        ProvinceID: 202,
                        ProvinceName: "Hồ Chí Minh",
                        Code: "8"
                    },
                    {
                        ProvinceID: 203,
                        ProvinceName: "Đà Nẵng",
                        Code: "511"
                    },
                    {
                        ProvinceID: 204,
                        ProvinceName: "Đồng Nai",
                        Code: "61"
                    }
                ];
                break;
                
            case 'districts':
                if (!provinceId) {
                    return NextResponse.json(
                        { error: 'Province ID is required for districts' },
                        { status: 400 }
                    );
                }
                
                // Mock districts for Hà Nội (201)
                if (provinceId === '201') {
                    data = [
                        {
                            DistrictID: 1454,
                            DistrictName: "Quận Ba Đình",
                            Code: "001",
                            ProvinceID: 201
                        },
                        {
                            DistrictID: 1455,
                            DistrictName: "Quận Hoàn Kiếm",
                            Code: "002",
                            ProvinceID: 201
                        },
                        {
                            DistrictID: 1456,
                            DistrictName: "Quận Hai Bà Trưng",
                            Code: "003",
                            ProvinceID: 201
                        }
                    ];
                } else {
                    data = [
                        {
                            DistrictID: 9999,
                            DistrictName: "Quận Mẫu",
                            Code: "001",
                            ProvinceID: parseInt(provinceId)
                        }
                    ];
                }
                break;
                
            case 'wards':
                if (!districtId) {
                    return NextResponse.json(
                        { error: 'District ID is required for wards' },
                        { status: 400 }
                    );
                }
                
                data = [
                    {
                        WardCode: "21211",
                        WardName: "Phường Phúc Xá",
                        DistrictID: parseInt(districtId)
                    },
                    {
                        WardCode: "21212",
                        WardName: "Phường Trúc Bạch",
                        DistrictID: parseInt(districtId)
                    },
                    {
                        WardCode: "21213",
                        WardName: "Phường Vĩnh Phúc",
                        DistrictID: parseInt(districtId)
                    }
                ];
                break;
                
            default:
                return NextResponse.json(
                    { error: 'Invalid type. Use: provinces, districts, or wards' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            code: 200,
            message: 'Success (Fallback Data)',
            data: data
        });
    } catch (error: any) {
        console.error('Error in fallback API:', error);
        return NextResponse.json(
            { error: 'Failed to provide fallback data' },
            { status: 500 }
        );
    }
} 