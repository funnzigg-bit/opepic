import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";

export async function generateBrief(prompt: string, itemIds: string[]) {
  const items = await prisma.item.findMany({
    where: itemIds.length ? { id: { in: itemIds } } : undefined,
    take: itemIds.length ? itemIds.length : 12,
    orderBy: { publishedAt: "desc" },
    include: { source: true }
  });

  const context = items
    .map(
      (item) =>
        `- ${item.title} | ${item.source.name} | topics=${parseJsonArray<string>(item.topics).join(",")} | summary=${item.summary}`
    )
    .join("\n");

  if (!process.env.OPENAI_API_KEY) {
    return {
      text: `AI fallback brief\n\nPrompt: ${prompt}\n\nAssessment: Elevated activity across nuclear, shipping, and cyber channels. Escalation pressure remains above baseline, centered on Hormuz transit risk, IAEA-linked narratives, and coalition signaling.\n\nKey evidence:\n${context || "- Seeded demo data available."}`
    };
  }

  const result = await generateText({
    model: openai("gpt-4.1-mini"),
    system:
      "You are an OSINT analyst generating concise, sober situational awareness briefs for a UNCLASS // OSINT dashboard. Use caveated language where confidence is low.",
    prompt: `${prompt}\n\nUse this source material:\n${context}`
  });

  return { text: result.text };
}
