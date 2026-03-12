"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/dashboard/ops-map-inner").then((mod) => mod.OpsMapInner), {
  ssr: false,
  loading: () => <div className="h-[520px] rounded-xl border border-border bg-card/60" />
});

export function OpsMap({ title }: { title?: string }) {
  return <DynamicMap title={title} />;
}
