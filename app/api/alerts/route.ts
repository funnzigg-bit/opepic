import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alertRuleSchema } from "@/lib/validation";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const rules = await prisma.alertRule.findMany({
    include: {
      hits: {
        include: {
          item: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(
    rules.map((rule) => ({
      ...rule,
      keywords: parseJsonArray<string>(rule.keywords),
      topicFilter: parseJsonArray<string>(rule.topicFilter),
      regionFilter: parseJsonArray<string>(rule.regionFilter)
    }))
  );
}

export async function POST(request: NextRequest) {
  const payload = alertRuleSchema.parse(await request.json());
  const rule = await prisma.alertRule.create({
    data: {
      ...payload,
      confidenceFilter: payload.confidenceFilter ?? null,
      keywords: JSON.stringify(payload.keywords),
      topicFilter: JSON.stringify(payload.topicFilter),
      regionFilter: JSON.stringify(payload.regionFilter)
    }
  });

  return NextResponse.json(rule, { status: 201 });
}
