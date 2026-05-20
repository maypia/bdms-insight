import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { departments } from "@/lib/mock-data";
import { Plus, Search, MoreHorizontal, Building2 } from "lucide-react";

export const Route = createFileRoute("/departments/")({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return (
    <AppLayout>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            จัดการแผนก ผู้ดูแล และข้อมูลความรู้ของแต่ละแผนก
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 shadow-[var(--shadow-soft)]">
          <Plus className="h-4 w-4" />
          New Department
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search department…"
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {departments.length} departments
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-surface-muted/60">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="font-medium px-6 py-3">Department</th>
              <th className="font-medium px-6 py-3">Manager</th>
              <th className="font-medium px-6 py-3">Contact</th>
              <th className="font-medium px-6 py-3 text-center">FAQs</th>
              <th className="font-medium px-6 py-3">Updated</th>
              <th className="font-medium px-6 py-3">Status</th>
              <th className="font-medium px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {departments.map((d) => (
              <tr key={d.id} className="hover:bg-surface-muted/40 transition">
                <td className="px-6 py-4">
                  <Link to="/departments/$id" params={{ id: d.id }} className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center text-xs font-semibold">
                      {d.code}
                    </div>
                    <div>
                      <div className="font-medium text-foreground group-hover:text-primary transition">{d.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{d.description}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-foreground">{d.manager}</td>
                <td className="px-6 py-4 text-muted-foreground tabular-nums">{d.contact}</td>
                <td className="px-6 py-4 text-center font-medium tabular-nums">{d.faqs.length}</td>
                <td className="px-6 py-4 text-muted-foreground tabular-nums">{d.updatedAt}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      d.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${d.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-surface-muted text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {departments.length === 0 && (
          <div className="p-16 text-center">
            <Building2 className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-3">No departments yet</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
