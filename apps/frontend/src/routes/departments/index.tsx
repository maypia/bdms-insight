import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { departments } from "@/lib/mock-data";
import { Plus, Search, MoreHorizontal, Building2, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/departments/")({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clinical Departments</h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            Overview, standard operating procedures, and clinical wikis for BDMS departments
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-xs font-semibold shadow-sm">
          <Plus className="h-3.5 w-3.5" />
          Add Department
        </button>
      </div>

      {/* Datagrid Table Card */}
      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-hidden animate-fade-in-up animation-delay-100">
        
        {/* Datagrid Header & Search */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-slate-50/50 dark:bg-slate-900/10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search clinical departments..."
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-900 dark:bg-slate-800/40 dark:border-slate-700 dark:focus:ring-white transition-all"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-border/80">
            {departments.length} clinics registered
          </div>
        </div>

        {/* Datagrid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-slate-50/30 dark:bg-slate-900/5">
                <th className="px-6 py-3.5 font-bold">Department</th>
                <th className="px-6 py-3.5 font-bold">Manager</th>
                <th className="px-6 py-3.5 font-bold">Contact</th>
                <th className="px-6 py-3.5 font-bold text-center">FAQs</th>
                <th className="px-6 py-3.5 font-bold">Last Updated</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {departments.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-all duration-200 group border-l-2 border-l-transparent hover:border-l-blue-500"
                >
                  {/* Department details */}
                  <td className="px-6 py-4">
                    <Link to="/departments/$id" params={{ id: d.id }} className="flex items-center gap-3.5">
                      <div className="h-9.5 w-9.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px] grid place-items-center transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {d.code}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {d.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[280px]">
                          {d.description}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Manager */}
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{d.manager}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Clinic Supervisor</div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-semibold">{d.contact}</span>
                  </td>

                  {/* FAQs count badge */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-border/80 font-mono">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      {d.faqs.length}
                    </span>
                  </td>

                  {/* Updated date */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-muted-foreground">{d.updatedAt}</span>
                  </td>

                  {/* Status pill */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                        d.status === "active"
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${d.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                      {d.status}
                    </span>
                  </td>

                  {/* Actions button */}
                  <td className="px-6 py-4">
                    <button className="h-7 w-7 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {departments.length === 0 && (
          <div className="p-16 text-center">
            <Building2 className="h-9 w-9 mx-auto text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground mt-3 font-semibold">No departments found in our clinical wiki.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
