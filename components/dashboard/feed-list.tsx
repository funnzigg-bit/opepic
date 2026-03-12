import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedItem } from "@/lib/types";

export function FeedList({ title, items }: { title: string; items: FeedItem[] }) {
  return (
    <Card className="h-full border-white/10 bg-[linear-gradient(180deg,rgba(19,31,38,.94),rgba(11,18,23,.92))]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">No live records are available for this panel yet.</div> : null}
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={item.confidence === "confirmed" ? "success" : item.confidence === "reported" ? "warning" : "default"}>{item.confidence}</Badge>
              <Badge variant={item.sentiment === "negative" ? "danger" : item.sentiment === "positive" ? "success" : "info"}>{item.sentiment}</Badge>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.source.name}</span>
            </div>
            <h4 className="mt-3 text-[15px] font-medium leading-6 text-white">{item.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
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
