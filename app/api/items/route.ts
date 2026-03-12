import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const confidence = searchParams.get("confidence");
  const sentiment = searchParams.get("sentiment");
  const sourceId = searchParams.get("sourceId");
  const limit = Number(searchParams.get("limit") ?? 50);

  const items = await prisma.item.findMany({
    where: {
      ...(confidence ? { confidence: confidence as never } : {}),
      ...(sentiment ? { sentiment: sentiment as never } : {}),
      ...(sourceId ? { sourceId } : {})
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" },
    take: Math.min(limit, 100)
  });

  const filtered = topic
    ? items.filter((item) => parseJsonArray<string>(item.topics).includes(topic))
    : items;

  return NextResponse.json(
    filtered.map((item) => ({
      ...item,
      topics: parseJsonArray<string>(item.topics),
      regionTags: parseJsonArray<string>(item.regionTags)
    }))
  );
}
