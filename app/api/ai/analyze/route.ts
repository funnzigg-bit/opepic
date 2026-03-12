import { NextRequest, NextResponse } from "next/server";
import { generateBrief } from "@/lib/server/ai";
import { analyzeSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const payload = analyzeSchema.parse(await request.json());
  const result = await generateBrief(payload.prompt, payload.itemIds);
  return NextResponse.json(result);
}
