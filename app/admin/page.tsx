import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <AppShell activePath="/admin" title="Admin" subtitle="Ingest controls, audit trail, user-ready layout administration, and operational governance surfaces.">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operational Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border/60 bg-background/40 p-4">Manual ingest trigger endpoint: `POST /api/ingest`</div>
            <div className="rounded-lg border border-border/60 bg-background/40 p-4">Layout persistence endpoint: `POST /api/dashboard-layouts`</div>
            <div className="rounded-lg border border-border/60 bg-background/40 p-4">Auth scaffold prepared for NextAuth integration.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.auditLog.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-primary">{entry.action}</div>
                <div className="mt-2 text-sm text-muted-foreground">{JSON.stringify(entry.details)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
