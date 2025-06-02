import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, uploadDir, keepExtensions: true });
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // /api/upload/single
  if (pathname.endsWith('/single')) {
    try {
      const { fields, files } = await parseForm(req);
      const file = files.file || files['file[]'];
      if (!file) {
        return NextResponse.json({
          success: false,
          error: 'No file uploaded',
          message: 'Please select a file to upload'
        }, { status: 400 });
      }
      const uploadType = fields.uploadType || 'temp';
      const uploadPath = path.join(uploadDir, uploadType);
      ensureDirSync(uploadPath);

      const uploadedFile = Array.isArray(file) ? file[0] : file;
      const filename = uploadedFile.newFilename;
      const imageUrl = `/uploads/${uploadType}/${filename}`;
      fs.renameSync(uploadedFile.filepath, path.join(uploadPath, filename));

      return NextResponse.json({
        success: true,
        data: {
          filename,
          originalName: uploadedFile.originalFilename,
          size: uploadedFile.size,
          mimetype: uploadedFile.mimetype,
          imageUrl,
          uploadType
        },
        message: 'File uploaded successfully'
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: 'Upload failed',
        message: error.message || 'Failed to upload file'
      }, { status: 500 });
    }
  }

  // /api/upload/multiple
  if (pathname.endsWith('/multiple')) {
    try {
      const { fields, files } = await parseForm(req);
      const uploadType = fields.uploadType || 'temp';
      const uploadPath = path.join(uploadDir, uploadType);
      ensureDirSync(uploadPath);

      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      if (!fileArray || fileArray.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No files uploaded',
          message: 'Please select files to upload'
        }, { status: 400 });
      }

      const uploadedFiles = fileArray.map((file: any) => {
        const filename = file.newFilename;
        fs.renameSync(file.filepath, path.join(uploadPath, filename));
        return {
          filename,
          originalName: file.originalFilename,
          size: file.size,
          mimetype: file.mimetype,
          imageUrl: `/uploads/${uploadType}/${filename}`
        };
      });

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
      return NextResponse.json({
        success: false,
        error: 'Upload failed',
        message: error.message || 'Failed to upload files'
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: false,
    error: 'Not found',
    message: 'Invalid upload route'
  }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const parts = pathname.split('/');
    const uploadType = parts[parts.length - 2];
    const filename = parts[parts.length - 1];

    const allowedTypes = ['products', 'categories', 'news', 'temp'];
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