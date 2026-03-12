import { Radar } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { LiveStream } from "@/components/dashboard/live-stream";
import { Badge } from "@/components/ui/badge";
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
          <Button variant="outline">Save Layout</Button>
          <Button>
            <Radar className="mr-2 h-4 w-4" />
            Trigger Ingest
          </Button>
        </>
      }
    >
      {data.degraded ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Database connection is unavailable. The dashboard is running in degraded mode until `DATABASE_URL` and the Prisma schema are fixed in production.
        </div>
      ) : null}
      <KpiStrip kpis={data.kpis} />
      <DashboardGrid initialLayout={commandCenter?.widgets ?? []} items={data.items} />
      <LiveStream />
    </AppShell>
  );
}
