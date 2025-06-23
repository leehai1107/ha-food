import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

const uploadsRoot = path.join(process.cwd(), "public", "uploads");

function walkDir(dir: string, baseUrl = "/uploads") {
  const result: any[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const url = path.join(baseUrl, item.name).replace(/\\/g, "/");
    if (item.isDirectory()) {
      result.push({
        name: item.name,
        type: "folder",
        url,
        children: walkDir(fullPath, url),
      });
    } else {
      result.push({
        name: item.name,
        type: "file",
        url,
        size: fs.statSync(fullPath).size,
      });
    }
  }
  return result;
}

export async function GET() {
  try {
    if (!fs.existsSync(uploadsRoot)) {
      fs.mkdirSync(uploadsRoot, { recursive: true });
    }
    const files = walkDir(uploadsRoot);
    return NextResponse.json({ success: true, data: files });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const folder = (formData.get("folder") as string) || "";
    const uploadPath = path.join(uploadsRoot, folder);
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "file" || key.startsWith("file[")) {
        if (value instanceof File) files.push(value);
      }
    }
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }
    const uploaded = [];
    for (const file of files) {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadPath, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      uploaded.push({
        name: filename,
        url: `/uploads/${folder ? folder + "/" : ""}${filename}`.replace(
          /\\/g,
          "/"
        ),
        size: file.size,
        type: file.type,
      });
    }
    return NextResponse.json({ success: true, data: uploaded });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get("file");
    if (!file)
      return NextResponse.json(
        { success: false, error: "No file specified" },
        { status: 400 }
      );
    const filePath = path.join(uploadsRoot, file);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
