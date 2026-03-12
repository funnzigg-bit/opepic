import { AppShell } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/server/data";

export default async function SourcesPage() {
  const data = await getDashboardData();

  return (
    <AppShell activePath="/sources" title="Sources" subtitle="Source registry with region tags, ingest modes, reliability labels, and custom source support.">
      <Card>
        <CardHeader>
          <CardTitle>Registered Sources ({data.sources.length})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.sources.map((source) => (
            <div key={source.id} className="rounded-xl border border-border/60 bg-background/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={source.reliability === "official" ? "success" : source.reliability === "reputable" ? "info" : "warning"}>{source.reliability}</Badge>
                <Badge>{source.type}</Badge>
                <Badge variant={source.enabled ? "success" : "default"}>{source.enabled ? "enabled" : "disabled"}</Badge>
              </div>
              <h3 className="mt-3 text-lg font-medium">{source.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{source.url}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {source.regionTags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
