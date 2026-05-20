import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { departments } from "@/lib/mock-data";
import { Search, Plus, Filter, Tag, Clock, Pencil, Trash2, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  component: KnowledgePage,
});

function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const selectedDeptLabel = useMemo(() => {
    if (deptFilter === "all") return "All Departments";
    const dept = departments.find((d) => d.id === deptFilter);
    return dept ? `${dept.name} Clinic` : "All Departments";
  }, [deptFilter]);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Knowledge Base</h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            Cross-departmental wikis, hospital SOP guidelines, and frequently asked clinical questions
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-xs font-semibold shadow-sm">
          <Plus className="h-3.5 w-3.5" />
          New Article
        </button>
      </div>

      {/* Glassmorphic Search & Filters Row */}
      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] p-4 mb-6 flex items-center gap-3 flex-wrap bg-slate-50/20 dark:bg-slate-900/5 animate-fade-in-up animation-delay-100">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinical questions, answers, or SOPs..."
            className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-900 dark:bg-slate-800/40 dark:border-slate-700 dark:focus:ring-white transition-all"
          />
        </div>

        {/* Custom Popover Dropdown Filter */}
        <div className="flex items-center gap-2 relative">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-2 h-8.5 px-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-all duration-200 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm active:scale-[0.98] outline-none min-w-[150px]"
            >
              <span>{selectedDeptLabel}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-card/95 backdrop-blur-md p-1 shadow-lg z-20 animate-fade-in-up">
                  <button
                    type="button"
                    onClick={() => {
                      setDeptFilter("all");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      deptFilter === "all"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                        : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    All Departments
                  </button>
                  {departments.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setDeptFilter(d.id);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        deptFilter === d.id
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                          : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-border/80">
          {filtered.length} articles found
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-16 text-center animate-fade-in">
          <HelpCircle className="h-9 w-9 mx-auto text-muted-foreground/50 animate-pulse" />
          <p className="text-xs text-muted-foreground mt-3 font-semibold">No SOP articles found matching your criteria.</p>
        </div>
      ) : (
        /* Bento Grid Clinical Articles */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((f, index) => {
            const delayClasses = ["", "animation-delay-100", "animation-delay-200", "animation-delay-300", "animation-delay-400"];
            const delayClass = delayClasses[index % delayClasses.length];
            return (
              <article
                key={f.id}
                className={`group rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md border-l-2 border-l-transparent hover:border-l-blue-500 transition-all duration-200 animate-fade-in-up ${delayClass}`}
              >
                {/* Meta details */}
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="text-[9px] font-bold font-mono text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-border bg-slate-50 dark:bg-slate-800 uppercase">
                    {f.deptCode}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {f.category}
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {f.question}
                </h3>

                {/* Answer snippet */}
                <p className="text-xs text-muted-foreground mt-2.5 line-clamp-3 leading-relaxed whitespace-pre-line">
                  {f.answer}
                </p>

                {/* Footer and Actions */}
                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-border/60">
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {f.updatedAt}
                    </span>
                    {f.tags && f.tags.length > 0 && (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {f.tags.length} tags
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="h-7 w-7 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="h-7 w-7 grid place-items-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
