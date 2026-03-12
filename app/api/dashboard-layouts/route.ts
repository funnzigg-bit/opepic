import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { layoutSchema } from "@/lib/validation";

export async function GET() {
  const layouts = await prisma.dashboardLayout.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(layouts.map((layout) => ({ ...layout, widgets: JSON.parse(layout.widgets) })));
}

export async function POST(request: NextRequest) {
  const payload = layoutSchema.parse(await request.json());
  const layout = await prisma.dashboardLayout.create({
    data: {
      userId: payload.userId,
      name: payload.name,
      widgets: JSON.stringify(payload.widgets)
    }
  });

  return NextResponse.json(layout, { status: 201 });
}
