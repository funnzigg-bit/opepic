import { Activity, Bell, ShieldAlert, Timer, TowerControl } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const icons = {
  threatcon: ShieldAlert,
  escalationScore: TowerControl,
  alerts: Bell,
  itemsLastHour: Activity,
  timer: Timer,
  activeSources: Activity
};

export function KpiStrip({ kpis }: { kpis: Record<string, string | number> }) {
  const labels: Record<string, string> = {
    threatcon: "Threatcon",
    escalationScore: "Escalation",
    alerts: "Active Alerts",
    itemsLastHour: "Items / 1h",
    timer: "T+ Timer",
    activeSources: "Active Sources"
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {Object.entries(kpis).map(([key, value]) => {
        const Icon = icons[key as keyof typeof icons] ?? Activity;
        return (
          <Card key={key} className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(19,31,38,.92),rgba(11,18,23,.92))]">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{labels[key] ?? key}</div>
                <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
              </div>
              <Badge variant={key === "threatcon" || key === "escalationScore" ? "danger" : "info"} className="shrink-0">
                <Icon className="mr-1 h-3.5 w-3.5" />
                Live
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
