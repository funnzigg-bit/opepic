import { Radar } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { LiveStream } from "@/components/dashboard/live-stream";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const commandCenter = data.layouts.find((layout) => layout.name === "Command Center") ?? data.layouts[0];

  return (
    <AppShell
      activePath="/dashboard"
      title="Command Center"
      subtitle="Customizable drag/drop operating picture with live ingest, AI briefs, and escalation telemetry."
      actions={
        <>
          <Badge variant="info">THREATCON {data.kpis.threatcon}</Badge>
          <Button variant="outline">Save Layout</Button>
          <Button>
            <Radar className="mr-2 h-4 w-4" />
            Trigger Ingest
          </Button>
        </>
      }
    >
      {data.degraded ? (
        <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-5 py-4 text-sm text-amber-50">
          {data.degradedReason === "error"
            ? "Live database data is unavailable, so the dashboard is running on the built-in demo intelligence pack."
            : "The database is connected but has no seeded records yet, so the dashboard is showing the built-in demo intelligence pack."}
        </div>
      ) : null}
      <KpiStrip kpis={data.kpis} />
      <DashboardGrid initialLayout={commandCenter?.widgets ?? []} items={data.items} />
      <LiveStream />
    </AppShell>
  );
}
