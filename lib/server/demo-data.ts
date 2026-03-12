import { formatThreatcon, scenarioClock } from "@/lib/utils";

const now = new Date("2026-03-12T12:00:00.000Z");

const demoItems = [
  {
    id: "demo-item-1",
    title: "IAEA inspectors flagged renewed narrative pressure around enrichment thresholds",
    summary: "Open-source reporting and diplomatic commentary indicate a fresh surge in scrutiny focused on enrichment pace, centrifuge cascades, and breakout signaling.",
    publishedAt: new Date(now.getTime() - 18 * 60 * 1000).toISOString(),
    source: { id: "demo-source-iaea", name: "IAEA Monitor" },
    topics: ["nuclear", "diplomacy"],
    regionTags: ["tehran", "isfahan", "iran"],
    confidence: "reported",
    sentiment: "negative"
  },
  {
    id: "demo-item-2",
    title: "Commercial tanker traffic through Hormuz slowed during elevated risk messaging",
    summary: "Tracking feeds suggest more cautious routing, wider spacing between transits, and higher insurance-risk chatter tied to military signaling in the Gulf.",
    publishedAt: new Date(now.getTime() - 42 * 60 * 1000).toISOString(),
    source: { id: "demo-source-shipping", name: "Hormuz Shipping Watch" },
    topics: ["shipping", "military"],
    regionTags: ["hormuz", "gulf"],
    confidence: "confirmed",
    sentiment: "negative"
  },
  {
    id: "demo-item-3",
    title: "Tehran telecom instability drove fresh cyber outage speculation",
    summary: "A mix of network telemetry, local reporting, and OSINT chatter points to intermittent service degradation affecting urban users and commercial operators.",
    publishedAt: new Date(now.getTime() - 65 * 60 * 1000).toISOString(),
    source: { id: "demo-source-cyber", name: "Cyber Availability Grid" },
    topics: ["cyber"],
    regionTags: ["tehran", "iran"],
    confidence: "reported",
    sentiment: "negative"
  },
  {
    id: "demo-item-4",
    title: "Regional airspace notices tightened around western Iranian corridors",
    summary: "Route advisories and risk notices suggest airlines are maintaining conservative buffers around contested corridors and military operating areas.",
    publishedAt: new Date(now.getTime() - 95 * 60 * 1000).toISOString(),
    source: { id: "demo-source-aviation", name: "Airspace Risk Desk" },
    topics: ["aviation", "military"],
    regionTags: ["iraq", "iran", "gulf"],
    confidence: "confirmed",
    sentiment: "neutral"
  },
  {
    id: "demo-item-5",
    title: "Sanctions enforcement messaging intensified across Treasury and partner channels",
    summary: "Western government releases continue to emphasize financial pressure, procurement disruption, and maritime compliance exposure.",
    publishedAt: new Date(now.getTime() - 130 * 60 * 1000).toISOString(),
    source: { id: "demo-source-sanctions", name: "Sanctions Wire" },
    topics: ["sanctions", "diplomacy"],
    regionTags: ["us", "eu", "iran"],
    confidence: "confirmed",
    sentiment: "negative"
  },
  {
    id: "demo-item-6",
    title: "Humanitarian agencies warned of spillover stress on medical and logistics chains",
    summary: "Preparedness messaging highlighted the need to monitor fuel access, movement restrictions, and secondary effects on civilian services.",
    publishedAt: new Date(now.getTime() - 170 * 60 * 1000).toISOString(),
    source: { id: "demo-source-humanitarian", name: "Relief Coordination" },
    topics: ["humanitarian"],
    regionTags: ["mena", "iran"],
    confidence: "reported",
    sentiment: "neutral"
  }
];

const demoSources = [
  { id: "demo-source-iaea", name: "IAEA Monitor", type: "rss", url: "https://www.iaea.org/newscenter/rss", regionTags: ["iran", "nuclear"], reliability: "official", mode: "metadata_only", enabled: true, allowEmbed: false, tosNotes: "Demo fallback source." },
  { id: "demo-source-shipping", name: "Hormuz Shipping Watch", type: "api", url: "https://example.com/shipping", regionTags: ["hormuz", "shipping"], reliability: "reputable", mode: "metadata_only", enabled: true, allowEmbed: false, tosNotes: "Demo fallback source." },
  { id: "demo-source-cyber", name: "Cyber Availability Grid", type: "cyber", url: "https://example.com/cyber", regionTags: ["iran", "cyber"], reliability: "reputable", mode: "metadata_only", enabled: true, allowEmbed: false, tosNotes: "Demo fallback source." },
  { id: "demo-source-aviation", name: "Airspace Risk Desk", type: "aviation", url: "https://example.com/aviation", regionTags: ["iran", "aviation"], reliability: "reputable", mode: "metadata_only", enabled: true, allowEmbed: false, tosNotes: "Demo fallback source." }
];

const demoLayouts = [
  {
    id: "demo-layout-command",
    userId: "demo-user",
    name: "Command Center",
    widgets: [
      { i: "feed-1", x: 0, y: 0, w: 4, h: 5, type: "feed" },
      { i: "map-1", x: 4, y: 0, w: 4, h: 5, type: "map" },
      { i: "chart-1", x: 8, y: 0, w: 4, h: 5, type: "chart" },
      { i: "ai-1", x: 0, y: 5, w: 6, h: 5, type: "ai_brief" },
      { i: "orbat-1", x: 6, y: 5, w: 3, h: 5, type: "orbat" },
      { i: "bda-1", x: 9, y: 5, w: 3, h: 5, type: "bda" }
    ]
  }
];

const demoAlertRules = [
  {
    id: "demo-rule-1",
    name: "Hormuz Escalation",
    keywords: ["hormuz", "shipping", "tanker"],
    topicFilter: ["shipping", "military"],
    regionFilter: ["hormuz", "gulf"],
    confidenceFilter: "reported",
    enabled: true,
    notifyMode: "in_app",
    createdAt: now.toISOString()
  }
];

const demoAlertHits = [
  {
    id: "demo-hit-1",
    createdAt: now.toISOString(),
    alertRule: { name: "Hormuz Escalation" },
    item: demoItems[1]
  }
];

const demoAuditLog = [
  {
    id: "demo-log-1",
    action: "fallback.demo_mode",
    actor: "system",
    details: { reason: "Database unavailable or empty. Demo operational picture loaded." },
    createdAt: now.toISOString()
  }
];

export function getDemoDashboardData(reason: "empty" | "error") {
  const escalationScore = 67;
  return {
    items: demoItems,
    sources: demoSources,
    alertRules: demoAlertRules,
    alertHits: demoAlertHits,
    layouts: demoLayouts,
    widgets: [],
    auditLog: demoAuditLog,
    degraded: true,
    degradedReason: reason,
    kpis: {
      escalationScore,
      threatcon: formatThreatcon(escalationScore),
      itemsLastHour: 6,
      alerts: 1,
      timer: scenarioClock(),
      activeSources: demoSources.length
    }
  };
}
