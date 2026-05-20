import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { departments } from "@/lib/mock-data";
import {
  ArrowLeft,
  Phone,
  Mail,
  Pencil,
  Plus,
  FileText,
  ListChecks,
  HelpCircle,
  Users,
  Paperclip,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/departments/$id")({
  loader: ({ params }) => {
    const dept = departments.find((d) => d.id === params.id);
    if (!dept) throw notFound();
    return { dept };
  },
  component: DepartmentDetail,
  notFoundComponent: () => (
    <AppLayout>
      <div className="p-12 text-center">
        <h1 className="text-xl font-semibold">Department not found</h1>
        <Link to="/departments" className="text-primary text-sm mt-3 inline-block">
          ← Back to departments
        </Link>
      </div>
    </AppLayout>
  ),
});

const tabs = [
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "procedures", label: "Procedures", icon: ListChecks },
  { id: "documents", label: "Required Documents", icon: FileText },
  { id: "contacts", label: "Contact Numbers", icon: Users },
  { id: "attachments", label: "SOP / Attachments", icon: Paperclip },
] as const;

function DepartmentDetail() {
  const { dept } = Route.useLoaderData();
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("faq");

  return (
    <AppLayout>
      <Link
        to="/departments"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> All departments
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] p-6 mb-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 font-mono font-extrabold text-xl grid place-items-center shadow-sm shrink-0">
            {dept.code}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{dept.name}</h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {dept.status}
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">{dept.description}</p>
            <div className="flex items-center gap-5 mt-4 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-wrap">
              <div className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>Manager: <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.manager}</span></span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-mono">{dept.contact}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{dept.managerEmail}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Updated {dept.updatedAt}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Link
              to="/assistant"
              search={{ dept: dept.id } as never}
              className="flex-1 md:flex-none h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 text-xs font-semibold shadow-sm active:scale-[0.98] transition-all duration-200"
            >
              Ask AI about {dept.code}
            </Link>
            <button className="flex-1 md:flex-none h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all duration-200 text-xs font-semibold shadow-sm">
              <Pencil className="h-3.5 w-3.5" /> Edit Wiki
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="border-b border-border px-3 flex items-center gap-1 overflow-x-auto bg-slate-50/30 dark:bg-slate-900/5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`relative inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition whitespace-nowrap ${
                  isActive ? "text-slate-900 dark:text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
                {isActive && <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-blue-500 rounded-full" />}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {active === "faq" && <FaqList faqs={dept.faqs} />}
          {active === "procedures" && <ProceduresList items={dept.procedures} />}
          {active === "documents" && <DocumentsList items={dept.documents} />}
          {active === "contacts" && <ContactsList items={dept.contacts} />}
          {active === "attachments" && <AttachmentsList items={dept.attachments} />}
        </div>
      </div>
    </AppLayout>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <Plus className="h-4 w-4" /> {action}
      </button>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-sm text-muted-foreground italic py-8 text-center">{msg}</div>;
}

function FaqList({ faqs }: { faqs: any[] }) {
  return (
    <div>
      <SectionHeader title="Frequently Asked Questions" action="Add FAQ" />
      {faqs.length === 0 ? (
        <Empty msg="ยังไม่มี FAQ — เพิ่มคำถามแรกเพื่อเริ่มต้น" />
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.id}
              className="group rounded-xl border border-border bg-surface hover:border-border-strong transition open:bg-surface-muted/30"
            >
              <summary className="cursor-pointer list-none flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-primary mb-1">
                    {f.category}
                  </div>
                  <div className="font-medium text-foreground">{f.question}</div>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">{f.updatedAt}</div>
              </summary>
              <div className="px-4 pb-4 pt-1 ml-0 text-sm text-foreground/90 whitespace-pre-line border-t border-border mt-2">
                <div className="pt-3">{f.answer}</div>
                {f.tags?.length > 0 && (
                  <div className="flex gap-1.5 mt-3">
                    {f.tags.map((t: string) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function ProceduresList({ items }: { items: any[] }) {
  return (
    <div>
      <SectionHeader title="Procedures & Workflows" action="Add procedure" />
      {items.length === 0 ? (
        <Empty msg="ยังไม่มีขั้นตอนการทำงาน" />
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="font-medium mb-3">{p.title}</div>
              <ol className="space-y-2">
                {p.steps.map((s: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-primary-soft text-primary grid place-items-center text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-foreground/90">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsList({ items }: { items: any[] }) {
  return (
    <div>
      <SectionHeader title="Required Documents" action="Add document" />
      {items.length === 0 ? (
        <Empty msg="ยังไม่มีรายการเอกสาร" />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {items.map((d) => (
            <li key={d.id} className="flex items-center gap-4 p-4 bg-surface">
              <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground grid place-items-center">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{d.name}</div>
                {d.note && <div className="text-xs text-muted-foreground mt-0.5">{d.note}</div>}
              </div>
              {d.required && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  Required
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContactsList({ items }: { items: any[] }) {
  return (
    <div>
      <SectionHeader title="Contact Numbers" action="Add contact" />
      {items.length === 0 ? (
        <Empty msg="ยังไม่มีข้อมูลติดต่อ" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-surface p-4 hover:border-border-strong transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center text-xs font-semibold">
                  {c.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-foreground/90"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{c.phone}</div>
                <div className="flex items-center gap-2 text-foreground/90"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{c.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AttachmentsList({ items }: { items: any[] }) {
  return (
    <div>
      <SectionHeader title="SOP & Attachments" action="Upload file" />
      {items.length === 0 ? (
        <Empty msg="ยังไม่มีไฟล์แนบ" />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {items.map((a) => (
            <li key={a.id} className="flex items-center gap-4 p-4 bg-surface hover:bg-surface-muted/40 transition">
              <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center text-[10px] font-semibold">
                {a.type}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.size}</div>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">Download</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
