import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sourceSchema } from "@/lib/validation";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const sources = await prisma.source.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(
    sources.map((source) => ({
      ...source,
      regionTags: parseJsonArray<string>(source.regionTags)
    }))
  );
}

export async function POST(request: NextRequest) {
  const payload = sourceSchema.parse(await request.json());
  const source = await prisma.source.create({
    data: {
      ...payload,
      regionTags: JSON.stringify(payload.regionTags)
    }
  });

  return NextResponse.json(source, { status: 201 });
}
