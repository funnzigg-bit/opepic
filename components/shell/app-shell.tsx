import Link from "next/link";
import { Bell, ChevronRight, History, LayoutDashboard, Map, Radar, Shield, Siren } from "lucide-react";
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
    <div className="min-h-screen px-3 py-3 sm:px-4">
      <div className="mx-auto grid min-h-screen max-w-[1620px] grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="panel-grid rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,27,34,.96),rgba(10,18,24,.92))] bg-signal-grid p-5 shadow-panel backdrop-blur lg:sticky lg:top-3 lg:h-[calc(100vh-1.5rem)]">
          <div className="mb-8 space-y-4">
            <Badge variant="warning" className="w-fit">UNCLASS // OSINT</Badge>
            <div>
              <h1 className="text-[30px] font-semibold tracking-[0.08em] text-white">IranSignal Pro</h1>
              <p className="mt-2 max-w-[22ch] text-sm leading-6 text-slate-300">A cleaner live command surface for Iran-related escalation, shipping, nuclear, and cyber monitoring.</p>
            </div>
          </div>
          <div className="mb-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">Mission State</div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">DELTA-3</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">March 2026 scenario</div>
              </div>
              <div className="text-right text-xs text-slate-300">Escalation pressure elevated across Hormuz, nuclear, and cyber lanes.</div>
            </div>
          </div>
          <nav className="space-y-2.5">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm transition-colors",
                    activePath === item.href
                      ? "border-cyan-400/25 bg-cyan-400/10 text-white"
                      : "border-transparent bg-white/[0.03] text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <ChevronRight className={cn("h-4 w-4 transition-transform", activePath === item.href ? "text-cyan-200" : "text-slate-500 group-hover:translate-x-0.5")} />
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-2xl border border-orange-400/15 bg-orange-400/8 p-4 text-sm">
            <div className="font-medium uppercase tracking-[0.18em] text-orange-200">{classification}</div>
            <p className="mt-2 leading-6 text-slate-300">This build includes a demo intelligence pack so the command view remains populated if live data infrastructure is not available.</p>
          </div>
        </aside>
        <main className="space-y-5 pb-6">
          <header className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(249,115,22,.15),transparent_28%),linear-gradient(180deg,rgba(16,26,34,.96),rgba(12,19,24,.94))] p-6 shadow-panel">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200">Operational View</div>
                <h2 className="mt-3 text-4xl font-semibold leading-tight text-white">{title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Classification</div>
                <div className="mt-2 text-sm font-medium text-white">{classification}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Scenario Clock</div>
                <div className="mt-2 text-sm font-medium text-white">T+ March 2026 escalation ladder</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Operating Model</div>
                <div className="mt-2 text-sm font-medium text-white">Live feeds, AI fusion, drag/drop command layout</div>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
