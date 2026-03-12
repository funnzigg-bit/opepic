import { AppShell } from "@/components/shell/app-shell";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { FeedList } from "@/components/dashboard/feed-list";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getDashboardData();

  return (
    <AppShell activePath="/overview" title="Overview" subtitle="Preconfigured cross-domain view for nuclear, sanctions, humanitarian, and escalation signals.">
      <KpiStrip kpis={data.kpis} />
      <div className="grid gap-6 xl:grid-cols-2">
        <FeedList title="Latest Updates" items={data.items.slice(0, 8)} />
        <FeedList title="Sanctions + Humanitarian" items={data.items.filter((item) => item.topics.includes("sanctions") || item.topics.includes("humanitarian")).slice(0, 8)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <MiniChart title="Escalation Trend" data={[{ name: "Mon", value: 44 }, { name: "Tue", value: 58 }, { name: "Wed", value: 62 }, { name: "Thu", value: data.kpis.escalationScore as number }, { name: "Fri", value: 80 }]} />
        <MiniChart title="Oil Risk" data={[{ name: "00", value: 77 }, { name: "06", value: 74 }, { name: "12", value: 82 }, { name: "18", value: 90 }]} color="#06b6d4" />
        <MiniChart title="Alert Velocity" data={[{ name: "1h", value: 3 }, { name: "3h", value: 8 }, { name: "6h", value: 11 }, { name: "12h", value: 14 }]} color="#ef4444" />
      </div>
    </AppShell>
  );
}
