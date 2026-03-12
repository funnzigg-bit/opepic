import { AppShell } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const data = await getDashboardData();

  return (
    <AppShell activePath="/alerts" title="Alerts" subtitle="Keyword and topic-based alert rules with in-app hits, ready for email/SMS transport adapters.">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alert Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.alertRules.map((rule) => (
              <div key={rule.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{rule.notifyMode}</Badge>
                  <Badge variant={rule.enabled ? "success" : "default"}>{rule.enabled ? "enabled" : "disabled"}</Badge>
                </div>
                <h3 className="mt-3 font-medium">{rule.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">Keywords: {rule.keywords.join(", ") || "none"}.</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alert Hits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.alertHits.map((hit) => (
              <div key={hit.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="danger">{hit.alertRule.name}</Badge>
                  <Badge>{hit.item.source.name}</Badge>
                </div>
                <h3 className="mt-3 font-medium">{hit.item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{hit.item.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
