import Link from "next/link";
import { Bell, History, LayoutDashboard, Map, Radar, Shield, Siren } from "lucide-react";
import { classification } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/overview", label: "Overview", icon: Radar },
  { href: "/timeline", label: "Timeline", icon: History },
  { href: "/map", label: "Map", icon: Map },
  { href: "/sources", label: "Sources", icon: Shield },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/admin", label: "Admin", icon: Siren }
];

export function AppShell({
  children,
  activePath,
  title,
  subtitle,
  actions
}: {
  children: React.ReactNode;
  activePath: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="panel-grid rounded-2xl border border-border bg-card/80 bg-signal-grid p-4 backdrop-blur lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="mb-6 space-y-3">
            <Badge variant="warning">{classification}</Badge>
            <div>
              <h1 className="text-2xl font-semibold tracking-[0.1em]">IranSignal Pro</h1>
              <p className="mt-2 text-sm text-muted-foreground">Mil-sim inspired command center for March 2026 escalation monitoring.</p>
            </div>
          </div>
          <nav className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-colors",
                    activePath === item.href ? "border-primary/50 bg-primary/10 text-white" : "border-transparent bg-muted/25 text-muted-foreground hover:border-border hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm">
            <div className="font-medium uppercase tracking-[0.18em] text-primary">Scenario</div>
            <p className="mt-2 text-muted-foreground">Fictional March 2026 T+ escalation timeline with UNCLASS // OSINT framing.</p>
          </div>
        </aside>
        <main className="space-y-6 py-2">
          <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-primary">Operational View</div>
              <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
