import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const code = searchParams.get('code');

    try {
        let url = '';
        if (type === 'provinces') {
            url = 'https://provinces.open-api.vn/api/p/';
        } else if (type === 'districts' && code) {
            url = `https://provinces.open-api.vn/api/p/${code}?depth=2`;
        } else if (type === 'wards' && code) {
            url = `https://provinces.open-api.vn/api/d/${code}?depth=2`;
        } else {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const response = await fetch(url);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch address data' }, { status: 500 });
    }
} 