import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const catalogues = await prisma.catalogue.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(catalogues);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const catalogue = await prisma.catalogue.create({ data });
  return NextResponse.json(catalogue);
}
