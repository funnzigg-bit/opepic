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
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {Object.entries(kpis).map(([key, value]) => {
        const Icon = icons[key as keyof typeof icons] ?? Activity;
        return (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{key}</div>
                <div className="mt-3 text-2xl font-semibold">{value}</div>
              </div>
              <Badge variant={key === "threatcon" || key === "escalationScore" ? "danger" : "info"}>
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
