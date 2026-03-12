"use client";

import { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { widgetCatalog } from "@/lib/constants";
import { FeedItem, WidgetConfig, WidgetLayoutItem } from "@/lib/types";
import { FeedList } from "@/components/dashboard/feed-list";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { OpsMap } from "@/components/dashboard/ops-map";
import { AIBriefCard } from "@/components/dashboard/ai-brief-card";

function renderWidget(item: WidgetLayoutItem, feedItems: FeedItem[]) {
  const title = widgetCatalog.find((widget) => widget.type === item.type)?.title ?? item.type;

  switch (item.type) {
    case "feed":
      return <FeedList title={title} items={feedItems.slice(0, 6)} />;
    case "map":
      return <OpsMap title={title} />;
    case "chart":
      return <MiniChart title={title} data={[{ name: "00Z", value: 42 }, { name: "06Z", value: 58 }, { name: "12Z", value: 74 }, { name: "18Z", value: 68 }, { name: "24Z", value: 81 }]} />;
    case "ai_brief":
      return <AIBriefCard />;
    case "orbat":
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>IRGC Navy: FAC swarms, anti-ship missile batteries, coastal ISR.</div>
            <div>Coalition: Carrier air wing, destroyer screen, ISR orbits, tanker support.</div>
            <div>Readiness: Elevated with contested Hormuz corridor assumptions.</div>
          </CardContent>
        </Card>
      );
    case "bda":
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>Site imagery delta: low-confidence thermal anomaly near logistics apron.</div>
            <div>Battle damage confidence: 62% based on multi-source OSINT fusion.</div>
            <div>Recommended follow-up: compare SAR and social footage before escalation scoring.</div>
          </CardContent>
        </Card>
      );
    default:
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Widget type `{item.type}` is available in the palette and can be specialized further.</CardContent>
        </Card>
      );
  }
}

export function DashboardGrid({ initialLayout, items }: { initialLayout: WidgetLayoutItem[]; items: FeedItem[] }) {
  const [layout, setLayout] = useState<Layout[]>(initialLayout);
  const [widgets, setWidgets] = useState<WidgetLayoutItem[]>(initialLayout);

  function addWidget(type: string) {
    const next: WidgetLayoutItem = {
      i: `${type}-${Date.now()}`,
      x: 0,
      y: Infinity,
      w: type === "map" ? 6 : 4,
      h: type === "map" ? 5 : 4,
      type
    };
    setWidgets((current) => [...current, next]);
    setLayout((current) => [...current, next]);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-border bg-card/60 p-3">
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={74} width={1080} onLayoutChange={(next) => setLayout(next)}>
          {widgets.map((widget) => (
            <div key={widget.i} className="overflow-hidden">
              {renderWidget(widget, items)}
            </div>
          ))}
        </GridLayout>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Widget Palette</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-1">
          {widgetCatalog.map((widget) => (
            <Button key={widget.id} variant="outline" className="justify-start" onClick={() => addWidget(widget.type)}>
              <widget.icon className="mr-2 h-4 w-4" />
              {widget.title}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
