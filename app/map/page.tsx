import { AppShell } from "@/components/shell/app-shell";
import { OpsMap } from "@/components/dashboard/ops-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const layers = [
  "OpenStreetMap Base",
  "OpenSky Flights",
  "Marine Shipping",
  "Strike Markers",
  "Cyber Incidents",
  "Weather Cells",
  "Satellite AOIs",
  "Earthquakes",
  "NOTAM Corridors",
  "Netblocks Outages"
];

export default function MapPage() {
  return (
    <AppShell activePath="/map" title="Interactive Map" subtitle="Leaflet-based AOI map prepared for 50+ overlays across shipping, aviation, cyber, weather, and BDA.">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <OpsMap title="Iran / Gulf Operations Map" />
        <Card>
          <CardHeader>
            <CardTitle>Available Layers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {layers.map((layer) => (
              <div key={layer} className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm">
                {layer}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
