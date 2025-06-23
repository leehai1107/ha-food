import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const uploadsRoot = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Missing folder name" },
        { status: 400 }
      );
    }

    const folderPath = path.join(uploadsRoot, name);
    if (fs.existsSync(folderPath)) {
      return NextResponse.json(
        { error: "Folder already exists" },
        { status: 400 }
      );
    }

    fs.mkdirSync(folderPath, { recursive: true });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("name");

    if (!folder) {
      return NextResponse.json(
        { error: "Missing folder name" },
        { status: 400 }
      );
    }

    const folderPath = path.join(uploadsRoot, folder);

    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Chặn xóa thư mục không nằm trong uploadsRoot (bảo vệ)
    if (!folderPath.startsWith(uploadsRoot)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    fs.rmSync(folderPath, { recursive: true, force: true });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
