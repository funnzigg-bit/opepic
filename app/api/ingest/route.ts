import { NextRequest, NextResponse } from "next/server";
import { ingestSources } from "@/lib/server/ingest";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const sourceIds = Array.isArray(payload.sourceIds) ? payload.sourceIds : undefined;
  const result = await ingestSources(sourceIds);
  return NextResponse.json(result);
}
