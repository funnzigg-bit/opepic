import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedItem } from "@/lib/types";

export function FeedList({ title, items }: { title: string; items: FeedItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border/60 bg-background/30 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={item.confidence === "confirmed" ? "success" : item.confidence === "reported" ? "warning" : "default"}>{item.confidence}</Badge>
              <Badge variant={item.sentiment === "negative" ? "danger" : item.sentiment === "positive" ? "success" : "info"}>{item.sentiment}</Badge>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.source.name}</span>
            </div>
            <h4 className="mt-3 font-medium">{item.title}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
              {item.topics.map((topic) => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
