import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Sparkles,
  Settings,
  LifeBuoy,
  LogOut,
  Search,
  Bell,
  Stethoscope,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles, badge: "AI" },
];

const secondary = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: LifeBuoy },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col sticky top-0 h-screen">
        {/* Sidebar Logo Header */}
        <div className="px-6 pt-6 pb-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white border border-blue-500/30 flex items-center justify-center shadow-sm shrink-0">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[13px] font-extrabold tracking-wider text-slate-900 dark:text-white font-sans uppercase">BDMS</div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest -mt-0.5">Insight Portal</div>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="px-3.5 flex-1">
          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
            Workspace
          </div>
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = isActive(item.to, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all border ${
                      active
                        ? "bg-white border-slate-200/60 text-slate-900 shadow-sm dark:bg-slate-800/60 dark:border-slate-700 dark:text-white"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/20"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 transition-colors ${active ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600"}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 uppercase animate-pulse-subtle">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mt-7 mb-2">
            System
          </div>
          <ul className="space-y-1">
            {secondary.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/20 border border-transparent transition-all"
                  >
                    <Icon className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer (Doctor / User profile card) */}
        <div className="p-3.5 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-all duration-200 group">
            <div className="h-8.5 w-8.5 rounded-xl bg-blue-600 text-white border border-blue-500/30 font-mono font-bold text-xs grid place-items-center shadow-sm shrink-0">
              {currentUser.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{currentUser.role}</div>
            </div>
            <Link to="/login" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md flex items-center px-8 gap-4 sticky top-0 z-20">
          {/* Header Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search clinical departments, SOPs, FAQs..."
              className="w-full h-8.5 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-900 dark:bg-slate-800/40 dark:border-slate-700 dark:focus:ring-white transition-all"
            />
            <kbd className="hidden md:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold font-mono text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-800">
              ⌘K
            </kbd>
          </div>
          
          <button className="h-8.5 w-8.5 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <Bell className="h-4.5 w-4.5" />
          </button>
          
          <Link
            to="/assistant"
            className="hidden md:inline-flex items-center gap-1.5 h-8.5 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-xs font-semibold shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask AI
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
