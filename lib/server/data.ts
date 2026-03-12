import { Confidence, Sentiment } from "@prisma/client";
import { subHours } from "date-fns";
import { prisma } from "@/lib/db";
import { getDemoDashboardData } from "@/lib/server/demo-data";
import { formatThreatcon, parseJsonArray, safeJsonParse, scenarioClock } from "@/lib/utils";

export async function getDashboardData() {
  try {
    const [items, sources, alertRules, alertHits, layouts, widgets, auditLog] = await Promise.all([
      prisma.item.findMany({
        take: 24,
        orderBy: { publishedAt: "desc" },
        include: { source: true }
      }),
      prisma.source.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.alertRule.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.alertHit.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { alertRule: true, item: { include: { source: true } } }
      }),
      prisma.dashboardLayout.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.widget.findMany(),
      prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } })
    ]);

    const itemsLastHour = await prisma.item.count({
      where: {
        publishedAt: { gte: subHours(new Date(), 1) }
      }
    });

    const escalationScore =
      Math.min(
        98,
        Math.round(
          items.filter((item) => item.sentiment === Sentiment.negative).length * 3 +
            items.filter((item) => item.confidence === Confidence.confirmed).length * 2 +
            alertHits.length * 1.5
        )
      ) || 42;

    if (items.length === 0 && sources.length === 0 && layouts.length === 0) {
      return getDemoDashboardData("empty");
    }

    return {
      items: items.map((item) => ({
        ...item,
        topics: parseJsonArray<string>(item.topics),
        regionTags: parseJsonArray<string>(item.regionTags)
      })),
      sources: sources.map((source) => ({
        ...source,
        regionTags: parseJsonArray<string>(source.regionTags)
      })),
      alertRules: alertRules.map((rule) => ({
        ...rule,
        keywords: parseJsonArray<string>(rule.keywords),
        topicFilter: parseJsonArray<string>(rule.topicFilter),
        regionFilter: parseJsonArray<string>(rule.regionFilter)
      })),
      alertHits: alertHits.map((hit) => ({
        ...hit,
        item: {
          ...hit.item,
          topics: parseJsonArray<string>(hit.item.topics),
          regionTags: parseJsonArray<string>(hit.item.regionTags)
        }
      })),
      layouts: layouts.map((layout) => ({
        ...layout,
        widgets: safeJsonParse(layout.widgets, [])
      })),
      widgets: widgets.map((widget) => ({
        ...widget,
        config: safeJsonParse(widget.config, {}),
        sourceIds: parseJsonArray<string>(widget.sourceIds)
      })),
      auditLog: auditLog.map((entry) => ({
        ...entry,
        details: safeJsonParse(entry.detailsJson, {})
      })),
      degraded: false,
      degradedReason: null,
      kpis: {
        escalationScore,
        threatcon: formatThreatcon(escalationScore),
        itemsLastHour,
        alerts: alertHits.length,
        timer: scenarioClock(),
        activeSources: sources.filter((source) => source.enabled).length
      }
    };
  } catch (error) {
    console.error("Dashboard data unavailable", error);
    return getDemoDashboardData("error");
  }
}
