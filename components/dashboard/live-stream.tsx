"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EventPayload = { type: string; message: string; createdAt: string };

export function LiveStream() {
  const [events, setEvents] = useState<EventPayload[]>([]);

  useEffect(() => {
    const source = new EventSource("/api/stream");
    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as EventPayload;
      setEvents((current) => [payload, ...current].slice(0, 8));
    };
    return () => source.close();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime Stream</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? <div className="text-sm text-muted-foreground">Awaiting SSE events.</div> : null}
        {events.map((event, index) => (
          <div key={`${event.createdAt}-${index}`} className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="flex items-center gap-2">
              <Badge variant="danger">{event.type}</Badge>
              <span className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleTimeString()}</span>
            </div>
            <p className="mt-2 text-sm">{event.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
