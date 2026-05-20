import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { departments } from "@/lib/mock-data";
import { Search, Plus, Filter, Tag, Clock, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  component: KnowledgePage,
});

function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const all = useMemo(
    () =>
      departments.flatMap((d) =>
        d.faqs.map((f) => ({ ...f, deptId: d.id, deptCode: d.code, deptName: d.name }))
      ),
    []
  );
  const filtered = all.filter((f) => {
    if (deptFilter !== "all" && f.deptId !== deptFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">
            คลังความรู้รวมจากทุกแผนก — ค้นหา จัดหมวดหมู่ และจัดการเนื้อหา
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 shadow-[var(--shadow-soft)]">
          <Plus className="h-4 w-4" /> New Article
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] p-4 mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาคำถาม คำตอบ หรือหมวดหมู่…"
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{filtered.length} articles</div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-16 text-center">
          <Search className="h-10 w-10 mx-auto text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground mt-3">ไม่พบบทความที่ตรงกับเงื่อนไข</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((f) => (
            <article
              key={f.id}
              className="group rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:border-border-strong transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary-soft uppercase">
                  {f.deptCode}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {f.category}
                </span>
              </div>
              <h3 className="font-semibold text-foreground leading-snug">{f.question}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3 whitespace-pre-line">{f.answer}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{f.updatedAt}</span>
                  {f.tags && f.tags.length > 0 && (
                    <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{f.tags.length}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-surface-muted text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
