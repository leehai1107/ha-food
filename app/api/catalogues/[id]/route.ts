import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { deleteFileFromUploads } from "@/lib/fileUtils";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const catalogue = await prisma.catalogue.findUnique({
    where: { id: Number(id) },
  });
  if (!catalogue)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(catalogue);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();

  // Get the current catalogue to compare old vs new files
  const currentCatalogue = await prisma.catalogue.findUnique({
    where: { id: Number(id) },
  });

  if (!currentCatalogue) {
    return NextResponse.json({ error: "Catalogue not found" }, { status: 404 });
  }

  // Delete old files if they're being replaced
  if (
    data.coverImage !== undefined &&
    data.coverImage !== currentCatalogue.coverImage
  ) {
    if (currentCatalogue.coverImage) {
      deleteFileFromUploads(currentCatalogue.coverImage);
    }
  }
  if (data.pdfLink !== undefined && data.pdfLink !== currentCatalogue.pdfLink) {
    if (currentCatalogue.pdfLink) {
      deleteFileFromUploads(currentCatalogue.pdfLink);
    }
  }

  const catalogue = await prisma.catalogue.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(catalogue);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Get the catalogue before deleting to access its files
  const catalogue = await prisma.catalogue.findUnique({
    where: { id: Number(id) },
  });

  if (catalogue) {
    // Delete associated files
    if (catalogue.coverImage) {
      deleteFileFromUploads(catalogue.coverImage);
    }
    if (catalogue.pdfLink) {
      deleteFileFromUploads(catalogue.pdfLink);
    }
  }

  await prisma.catalogue.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
