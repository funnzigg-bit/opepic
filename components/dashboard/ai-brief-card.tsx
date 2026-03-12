"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function AIBriefCard() {
  const [prompt, setPrompt] = useState("Summarize the latest on Strait of Hormuz shipping risk and Iranian nuclear signaling.");
  const [result, setResult] = useState<string>("No AI brief generated yet.");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const response = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, itemIds: [] })
    });
    const json = await response.json();
    setResult(json.text);
    setLoading(false);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Analyst</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        <Button onClick={submit} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Brief
        </Button>
        <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm whitespace-pre-wrap text-muted-foreground">{result}</div>
      </CardContent>
    </Card>
  );
}
