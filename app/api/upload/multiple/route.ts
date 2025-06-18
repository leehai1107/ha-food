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
    const uploadType = formData.get('uploadType') as string || 'temp';
    
    // Get all files from formData
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'file' || key.startsWith('file[')) {
        if (value instanceof File) {
          files.push(value);
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files uploaded',
        message: 'Please select files to upload'
      }, { status: 400 });
    }

    // Create upload directory
    const uploadPath = path.join(uploadDir, uploadType);
    ensureDirSync(uploadPath);

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file size (1GB limit)
      const maxSize = 1024 * 1024 * 1024; // 1GB
      if (file.size > maxSize) {
        return NextResponse.json({
          success: false,
          error: 'File too large',
          message: `File ${file.name} is too large. Must be less than 1GB`
        }, { status: 400 });
      }

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

      uploadedFiles.push({
        filename,
        originalName,
        size: file.size,
        mimetype: file.type,
        imageUrl: `/uploads/${uploadType}/${filename}`
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        files: uploadedFiles,
        uploadType,
        count: uploadedFiles.length
      },
      message: `${uploadedFiles.length} files uploaded successfully`
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed',
      message: error.message || 'Failed to upload files'
    }, { status: 500 });
  }
} 