import { ArrowUpRight, Radio, ShieldAlert, ShipWheel, TriangleAlert, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedItem } from "@/lib/types";

const sectors = [
  { label: "Nuclear", value: "Elevated", icon: ShieldAlert, tone: "danger" as const },
  { label: "Shipping", value: "Contested", icon: ShipWheel, tone: "warning" as const },
  { label: "Markets", value: "Reactive", icon: ArrowUpRight, tone: "info" as const },
  { label: "Weather", value: "Stable", icon: Waves, tone: "success" as const }
];

export function CommandBrief({ items }: { items: FeedItem[] }) {
  const lead = items[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_.9fr_.9fr]">
      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(17,30,37,.95),rgba(10,17,22,.92))]">
        <CardHeader>
          <CardTitle>Command Brief</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="danger">
              <Radio className="mr-1 h-3.5 w-3.5" />
              Live Analysis
            </Badge>
            <Badge variant="info">Updated continuously</Badge>
          </div>
          <div className="text-lg font-medium leading-8 text-white">
            {lead?.title ?? "Escalation pressure remains elevated across nuclear, shipping, and cyber lanes."}
          </div>
          <p className="text-sm leading-7 text-slate-300">
            {lead?.summary ??
              "The command picture centers on Hormuz shipping risk, enforcement messaging, airspace caution, and cyber availability concerns. This board remains usable even when live infrastructure is degraded."}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Priority AOI</div>
              <div className="mt-2 text-sm font-medium text-white">Strait of Hormuz</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Immediate Watch</div>
              <div className="mt-2 text-sm font-medium text-white">Shipping + IAEA signals</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Confidence Bias</div>
              <div className="mt-2 text-sm font-medium text-white">OSINT / mixed-source</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(17,30,37,.95),rgba(10,17,22,.92))]">
        <CardHeader>
          <CardTitle>Sector Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <div key={sector.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 p-2">
                    <Icon className="h-4 w-4 text-slate-200" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{sector.label}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Current posture</div>
                  </div>
                </div>
                <Badge variant={sector.tone}>{sector.value}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(17,30,37,.95),rgba(10,17,22,.92))]">
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Hormuz transit interruptions",
            "IAEA inspection language shift",
            "Tehran telecom instability",
            "Emergency sanctions coordination",
            "Airspace risk notices"
          ].map((entry, index) => (
            <div key={entry} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-300" />
              <div>
                <div className="text-sm text-white">{entry}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Queue {index + 1}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
