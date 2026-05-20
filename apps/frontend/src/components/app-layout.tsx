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
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="px-5 pt-6 pb-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow)]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">BDMS</div>
              <div className="text-[11px] text-muted-foreground -mt-0.5">Department Assistant</div>
            </div>
          </Link>
        </div>

        <nav className="px-3 flex-1">
          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground px-3 mb-2 uppercase">
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
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[var(--shadow-soft)]"
                        : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`}
                  >
                    <Icon className={`h-[18px] w-[18px] ${active ? "text-primary" : ""}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground px-3 mt-7 mb-2 uppercase">
            System
          </div>
          <ul className="space-y-1">
            {secondary.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/60">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center text-xs font-semibold">
              {currentUser.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</div>
              <div className="text-[11px] text-muted-foreground capitalize">{currentUser.role}</div>
            </div>
            <Link to="/login" className="text-muted-foreground hover:text-foreground" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60 flex items-center px-8 gap-4 sticky top-0 z-20">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search departments, FAQs, documents…"
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/60 transition"
            />
            <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-surface">
              ⌘K
            </kbd>
          </div>
          <button className="h-10 w-10 grid place-items-center rounded-lg hover:bg-surface-muted text-muted-foreground hover:text-foreground transition">
            <Bell className="h-[18px] w-[18px]" />
          </button>
          <Link
            to="/assistant"
            className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 shadow-[var(--shadow-soft)]"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Link>
        </header>

        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
