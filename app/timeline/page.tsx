import { AppShell } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/server/data";

export default async function TimelinePage() {
  const data = await getDashboardData();

  return (
    <AppShell activePath="/timeline" title="Timeline" subtitle="Infinite-scroll style event ledger for cross-filtering items by topic, confidence, and sentiment.">
      <Card>
        <CardHeader>
          <CardTitle>Event Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={item.sentiment === "negative" ? "danger" : item.sentiment === "positive" ? "success" : "info"}>{item.sentiment}</Badge>
                <Badge variant={item.confidence === "confirmed" ? "success" : "warning"}>{item.confidence}</Badge>
                {item.topics.map((topic) => (
                  <Badge key={topic}>{topic}</Badge>
                ))}
              </div>
              <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
              <div className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {item.source.name} | {new Date(item.publishedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
