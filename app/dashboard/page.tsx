import { Radar } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { LiveStream } from "@/components/dashboard/live-stream";
import { getDashboardData } from "@/lib/server/data";

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
          <Button variant="outline">Save Layout</Button>
          <Button>
            <Radar className="mr-2 h-4 w-4" />
            Trigger Ingest
          </Button>
        </>
      }
    >
      <KpiStrip kpis={data.kpis} />
      <DashboardGrid initialLayout={commandCenter?.widgets ?? []} items={data.items} />
      <LiveStream />
    </AppShell>
  );
}
