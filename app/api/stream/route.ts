export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let interval: NodeJS.Timeout | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      send({ type: "status", message: "IranSignal Pro live stream online.", createdAt: new Date().toISOString() });

      interval = setInterval(() => {
        const labels = [
          "Hormuz tanker routing disruption report.",
          "IAEA-linked narrative spike detected.",
          "OpenSky airspace density changed over western Iran.",
          "New cyber outage chatter in Tehran telecom sector."
        ];
        send({
          type: "update",
          message: labels[Math.floor(Math.random() * labels.length)],
          createdAt: new Date().toISOString()
        });
      }, 5000);
    },
    cancel() {
      if (interval) clearInterval(interval);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
