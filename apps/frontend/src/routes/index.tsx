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
  delayClass = "",
}: {
  icon: any;
  label: string;
  value: string | number;
  delta?: string;
  tone?: "primary" | "accent" | "success" | "warning";
  delayClass?: string;
}) {
  const iconColorMap: Record<string, string> = {
    primary: "text-slate-500 dark:text-slate-400 group-hover:text-blue-500",
    accent: "text-slate-500 dark:text-slate-400 group-hover:text-purple-500",
    success: "text-slate-500 dark:text-slate-400 group-hover:text-emerald-500",
    warning: "text-slate-500 dark:text-slate-400 group-hover:text-amber-500",
  };

  return (
    <div className={`group relative rounded-xl bg-card border border-border/80 p-5 shadow-[var(--shadow-soft)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 animate-fade-in-up ${delayClass}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="h-8 w-8 rounded-lg border border-border/50 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-center transition-colors">
          <Icon className={`h-4 w-4 ${iconColorMap[tone]} transition-colors duration-300`} />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
          {value}
        </div>
        
        {delta && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
            <TrendingUp className="h-3 w-3" />
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 mb-8 shadow-sm group">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] opacity-50" />
        
        {/* Crisp accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400 opacity-90" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8 animate-fade-in-up">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              สวัสดีค่ะ, Dr. Pattara
            </h1>
            <p className="text-sm md:text-[15px] text-muted-foreground mt-3 leading-relaxed">
              ค้นหาข้อมูลแผนก ขั้นตอนการทำงาน และเอกสารต่าง ๆ ได้ในที่เดียว — ถามผู้ช่วย AI เพื่อคำตอบที่รวดเร็วและแม่นยำตามมาตรฐานโรงพยาบาล
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-[280px]">
            <Link
              to="/assistant"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-sm shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              Open AI Assistant
            </Link>
            <Link
              to="/departments"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-background border border-border text-foreground font-medium hover:bg-muted active:scale-[0.98] transition-all duration-200 text-sm shadow-sm"
            >
              Browse Departments
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={Building2} label="Total Departments" value={dashboardStats.totalDepartments} delta="+2 this month" delayClass="animation-delay-100" />
        <Stat icon={BookOpen} label="Knowledge Articles" value={dashboardStats.totalFaqs} tone="accent" delta="+18%" delayClass="animation-delay-200" />
        <Stat icon={MessageSquare} label="Chat Sessions" value={dashboardStats.chatSessions.toLocaleString()} tone="success" delta="+24%" delayClass="animation-delay-300" />
        <Stat icon={Clock} label="Recent Updates (30d)" value={dashboardStats.knowledgeUpdates} tone="warning" delayClass="animation-delay-400" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent updates */}
        <section className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] animate-fade-in-up animation-delay-400">
          <header className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Recent knowledge updates</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Latest clinical changes across all departments</p>
            </div>
            <Link to="/knowledge" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ul className="divide-y divide-border/60">
            {recentUpdates.map((u) => (
              <li key={u.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 border-l-2 border-l-transparent hover:border-l-indigo-500 transition-all duration-200 group">
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px] grid place-items-center transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:border-indigo-200 dark:group-hover:border-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {u.department}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{u.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                    <span>โดย <span className="font-medium text-slate-600 dark:text-slate-400">{u.by}</span></span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>{u.at}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 transition-transform duration-200" />
              </li>
            ))}
          </ul>
        </section>

        {/* Departments quick list */}
        <section className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] animate-fade-in-up animation-delay-500">
          <header className="px-6 py-5 border-b border-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Top departments</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Most active clinical departments this week</p>
          </header>
          <ul className="p-3 space-y-1.5">
            {departments.slice(0, 5).map((d) => (
              <li key={d.id}>
                <Link
                  to="/departments/$id"
                  params={{ id: d.id }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50/40 dark:hover:bg-slate-800/20 border-l-2 border-l-transparent hover:border-l-blue-500 transition-all duration-200 group"
                >
                  <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px] grid place-items-center transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {d.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{d.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-border/80">
                        {d.faqs.length} FAQs
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 transition-transform duration-200" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
