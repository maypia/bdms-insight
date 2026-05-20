import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { dashboardStats, departments, recentUpdates } from "@/lib/mock-data";
import {
  Building2,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Stat({
  icon: Icon,
  label,
  value,
  delta,
  tone = "primary",
}: {
  icon: any;
  label: string;
  value: string | number;
  delta?: string;
  tone?: "primary" | "accent" | "success" | "warning";
}) {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  };
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl grid place-items-center ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <TrendingUp className="h-3 w-3" />
            {delta}
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary via-primary to-[oklch(0.5_0.18_255)] text-primary-foreground p-8 mb-8 shadow-[var(--shadow-glow)]">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/15 backdrop-blur px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered knowledge
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-4">
              สวัสดีค่ะ, Dr. Pattara
            </h1>
            <p className="text-primary-foreground/85 mt-2 text-[15px] leading-relaxed">
              ค้นหาข้อมูลแผนก ขั้นตอนการทำงาน และเอกสารต่าง ๆ ได้ในที่เดียว — ถามผู้ช่วย AI เพื่อคำตอบที่รวดเร็ว
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-primary font-medium hover:bg-white/95 transition shadow-[var(--shadow-soft)]"
            >
              <Sparkles className="h-4 w-4" />
              Open AI Assistant
            </Link>
            <Link
              to="/departments"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 font-medium transition"
            >
              Browse Departments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={Building2} label="Total Departments" value={dashboardStats.totalDepartments} delta="+2 this month" />
        <Stat icon={BookOpen} label="Knowledge Articles" value={dashboardStats.totalFaqs} tone="accent" delta="+18%" />
        <Stat icon={MessageSquare} label="Chat Sessions" value={dashboardStats.chatSessions.toLocaleString()} tone="success" delta="+24%" />
        <Stat icon={Clock} label="Recent Updates (30d)" value={dashboardStats.knowledgeUpdates} tone="warning" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent updates */}
        <section className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <header className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-base font-semibold">Recent knowledge updates</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest changes across all departments</p>
            </div>
            <Link to="/knowledge" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {recentUpdates.map((u) => (
              <li key={u.id} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-muted/50 transition">
                <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center text-xs font-semibold">
                  {u.department}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{u.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">โดย {u.by} · {u.at}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </section>

        {/* Departments quick list */}
        <section className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <header className="px-6 py-5 border-b border-border">
            <h2 className="text-base font-semibold">Top departments</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Most active this week</p>
          </header>
          <ul className="p-3">
            {departments.slice(0, 5).map((d) => (
              <li key={d.id}>
                <Link
                  to="/departments/$id"
                  params={{ id: d.id }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-muted transition"
                >
                  <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground grid place-items-center text-[11px] font-semibold">
                    {d.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.faqs.length} FAQs</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
