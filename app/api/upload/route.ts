import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const parts = pathname.split('/');
    const uploadType = parts[parts.length - 2];
    const filename = parts[parts.length - 1];

    const allowedTypes = ['products', 'categories', 'news', 'galleries', 'temp'];
    if (!allowedTypes.includes(uploadType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid upload type',
        message: 'Upload type must be one of: ' + allowedTypes.join(', ')
      }, { status: 400 });
    }

    const filePath = path.join(uploadDir, uploadType, filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'File not found',
        message: 'The specified file does not exist'
      }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      data: { filename, uploadType }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Delete failed',
      message: error.message || 'Failed to delete file'
    }, { status: 500 });
  }
}