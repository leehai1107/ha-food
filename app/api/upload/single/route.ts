import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('uploadType') as string || 'temp';

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      }, { status: 400 });
    }

    // Validate file size (1GB limit)
    const maxSize = 1024 * 1024 * 1024; // 1GB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large',
        message: 'File size must be less than 1GB'
      }, { status: 400 });
    }

    // Create upload directory
    const uploadPath = path.join(uploadDir, uploadType);
    ensureDirSync(uploadPath);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}${extension}`;
    const filePath = path.join(uploadPath, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${uploadType}/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        filename,
        originalName,
        size: file.size,
        mimetype: file.type,
        imageUrl,
        uploadType
      },
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed',
      message: error.message || 'Failed to upload file'
    }, { status: 500 });
  }
} 