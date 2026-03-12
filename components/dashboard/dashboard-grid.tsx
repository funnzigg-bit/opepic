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
  const quickWidgets = widgetCatalog.slice(0, 8);

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
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,30,.9),rgba(10,16,21,.9))] p-3">
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Canvas</div>
            <div className="mt-1 text-sm text-white">Active layout with draggable intelligence widgets</div>
          </div>
          <div className="text-xs text-slate-400">{widgets.length} widgets loaded</div>
        </div>
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={74} width={1080} onLayoutChange={(next) => setLayout(next)}>
          {widgets.map((widget) => (
            <div key={widget.i} className="overflow-hidden">
              {renderWidget(widget, items)}
            </div>
          ))}
        </GridLayout>
      </div>
      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(19,31,38,.94),rgba(11,18,23,.92))]">
        <CardHeader>
          <CardTitle>Widget Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {quickWidgets.map((widget) => (
              <Button key={widget.id} variant="outline" className="justify-start border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]" onClick={() => addWidget(widget.type)}>
                <widget.icon className="mr-2 h-4 w-4" />
                {widget.title}
              </Button>
            ))}
          </div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Full Catalog</div>
          <div className="grid max-h-[620px] grid-cols-1 gap-2 overflow-auto pr-1 md:grid-cols-2 xl:grid-cols-1">
            {widgetCatalog.map((widget) => (
            <Button key={widget.id} variant="outline" className="justify-start border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04]" onClick={() => addWidget(widget.type)}>
              <widget.icon className="mr-2 h-4 w-4" />
              {widget.title}
            </Button>
          ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
