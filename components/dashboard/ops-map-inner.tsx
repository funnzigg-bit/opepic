"use client";

import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const markers: Array<{ label: string; position: [number, number]; radius: number; tone: string }> = [
  { label: "Tehran", position: [35.6892, 51.389] as [number, number], radius: 80000, tone: "#f97316" },
  { label: "Isfahan", position: [32.6546, 51.668], radius: 56000, tone: "#06b6d4" },
  { label: "Bandar Abbas", position: [27.1832, 56.2666], radius: 70000, tone: "#ef4444" },
  { label: "Strait of Hormuz", position: [26.5667, 56.25], radius: 90000, tone: "#facc15" }
];

export function OpsMapInner({ title = "Area Map" }: { title?: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[420px]">
        <MapContainer center={[30.2, 53.5]} zoom={5} scrollWheelZoom className="h-full rounded-lg">
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker) => (
            <div key={marker.label}>
              <Marker position={marker.position} icon={icon}>
                <Popup>{marker.label}</Popup>
              </Marker>
              <Circle center={marker.position} radius={marker.radius} pathOptions={{ color: marker.tone, fillOpacity: 0.08 }} />
            </div>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
