import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { departments, currentUser } from "@/lib/mock-data";
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
  Ticket,
  Check,
  Loader2,
  AlertCircle,
  Inbox,
  ExternalLink,
  X,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  { id: "tickets", label: "Tickets & Submissions", icon: Ticket },
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
          {active === "tickets" && <TicketsList deptId={dept.id} />}
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

// ----------------------------------------------------
// Hospital Accounts Payable (AP) Ticketing Subsystem
// ----------------------------------------------------

type TicketType = {
  ticketId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  attachmentUrl?: string | null;
  createdAt: string;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

const API_BASE = "http://localhost:3001/api";

const CATEGORY_CHECKLISTS: Record<string, { label: string; doc: string }[]> = {
  DEBT_SETUP: [
    { label: "Tax Invoice", doc: "ต้นฉบับใบกำกับภาษี" },
    { label: "Receipt (Goods)", doc: "ใบเสร็จรับเงิน (กรณีได้รับสินค้าแล้ว)" },
    { label: "Invoice", doc: "ใบแจ้งหนี้" },
    { label: "Delivery Note", doc: "ใบส่งของ" },
    { label: "Billing Statement", doc: "ใบวางบิล" },
  ],
  PAYMENT: [
    { label: "Tax Invoice (Services)", doc: "ต้นฉบับใบกำกับภาษี (สำหรับงานบริการ)" },
    { label: "Receipt (Services)", doc: "ใบเสร็จรับเงิน (สำหรับงานบริการ)" },
    { label: "Work Handover (Construction)", doc: "ใบส่งมอบงาน (สำหรับงานก่อสร้าง)" },
    { label: "COP (Construction)", doc: "Certificate of Payment (COP)" },
  ],
  TE_ADVANCE: [
    { label: "TE Form", doc: "แบบฟอร์มเงินทดรองจ่าย (มูลค่า > 3,000 บาท)" },
    { label: "Memo Approval", doc: "บันทึกข้อความขออนุมัติสะสาง" },
    { label: "Authorized Copy", doc: "หลักการการอนุมัติตามอำนาจดำเนินการ" },
  ],
  TE_CLEAR: [
    { label: "Copy of Advance Request", doc: "สำเนาแบบฟอร์มเงินทดรองจ่าย" },
    { label: "Original Receipt", doc: "ใบเสร็จรับเงินตัวจริง" },
  ],
  PETTY_CASH: [
    { label: "Petty Cash Form", doc: "แบบฟอร์มการเบิกเงินสดย่อย (มูลค่า < 3,000 บาท)" },
    { label: "Invoice", doc: "ใบแจ้งหนี้" },
    { label: "Receipt", doc: "ใบเสร็จรับเงินตัวจริง" },
    { label: "Authorized Copy", doc: "หลักการการอนุมัติตามอำนาจดำเนินการ" },
  ],
  OTHER: [
    { label: "General Docs", doc: "เอกสารประกอบการขอสอบถาม/ดำเนินการทั่วไป" }
  ]
};

const CATEGORY_LABELS: Record<string, string> = {
  OTHER: "งานทั่วไป / สอบถามอื่นๆ (General)"
};

const CATEGORY_INSTRUCTIONS: Record<string, string> = {
  DEBT_SETUP: "ระเบียบการตั้งหนี้ (Debt Setup Policy):\n• กำหนดวันจ่ายชำระโอนและรับเช็คทุกวันพุธและศุกร์ เวลา 13:30 - 16:00 น.\n• กรุณาส่งชุดเอกสารเพื่อดำเนินการตั้งหนี้ภายในวันที่ 5 ของเดือน\n• ตรวจเช็คเอกสารและแนบลิงก์ชุดเอกสาร PDF ให้ครบถ้วนเพื่อทำการบันทึกและส่งสัญญานไปแผนกบัญชีเจ้าหนี้",
  PAYMENT: "ระเบียบการจ่ายเงิน (Payment Policy):\n• ประเภทงานบริการ: แนบชุดเอกสารต้นฉบับใบกำกับภาษี และใบเสร็จรับเงินที่ลงนามครบถ้วน\n• ประเภทงานก่อสร้าง: แนบใบส่งมอบงาน และหนังสือรับรองงวดงาน Certificate of Payment (COP)",
  TE_ADVANCE: "ระเบียบการเบิกเงินทดรองจ่าย (TE Advance Policy):\n• จำกัดการเบิกเฉพาะยอดเงินที่มีมูลค่ามากกว่า 3,000 บาทขึ้นไป\n• แนบแบบฟอร์มเงินทดรอง พร้อมบันทึกข้อความ (Memo) ขออนุมัติสะสางและเอกสารอนุมัติตามอำนาจดำเนินการ",
  TE_CLEAR: "ระเบียบการเคลียร์เงินทดรอง (Clear TE Advance Policy):\n• ยื่นเคลียร์เอกสารโดยแนบสำเนาแบบฟอร์มเงินทดรองจ่ายเดิม\n• แนบใบเสร็จรับเงินตัวจริงที่สมบูรณ์ตรงตามประเภทของค่าใช้จ่าย",
  PETTY_CASH: "ระเบียบการเบิกเงินสดย่อย (Petty Cash Policy):\n• จำกัดการเบิกสำหรับค่าใช้จ่ายที่มีมูลค่าต่ำกว่า 3,000 บาท\n• แนบแบบฟอร์มการเบิกเงินสดย่อยพร้อมใบแจ้งหนี้ ใบเสร็จรับเงิน และเอกสารอนุมัติตามอำนาจดำเนินการ",
  OTHER: "คำถามหรือบริการสอบถามทั่วไป:\n• ฝากเรื่องหรือสอบถามนโยบายการเบิกจ่ายและการเงินทั่วไปของโรงพยาบาลและแผนกต่างๆ"
};

function TicketsList({ deptId }: { deptId: string }) {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  
  // Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("DEBT_SETUP");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manage Modal state
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageAttachmentUrls, setManageAttachmentUrls] = useState<Record<number, string>>({});
  const [manageAttachmentTypes, setManageAttachmentTypes] = useState<Record<number, "link" | "file">>({});
  const [manageCheckedItems, setManageCheckedItems] = useState<Record<number, boolean>>({});
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);
  const [isDismissingTicket, setIsDismissingTicket] = useState(false);
  const [dismissConfirmId, setDismissConfirmId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("DEBT_SETUP");
    setPriority("MEDIUM");
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tickets?departmentId=${deptId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTickets(data);
      setIsLive(true);
    } catch (err) {
      console.warn("Backend offline, falling back to mock tickets state.", err);
      setIsLive(false);
      
      // Seed default local mock tickets
      const initialMockTickets = [
        {
          ticketId: "mock-1",
          title: "ส่งเอกสารตั้งหนี้เวชภัณฑ์คงคลัง (Pharm-AP-99)",
          description: "แนบต้นฉบับใบกำกับภาษี ใบวางบิล และใบแจ้งหนี้เวชภัณฑ์จากผู้จัดจำหน่ายหลัก จำนวนเงินรวม 254,000 บาท แผนกคลังยาขอความอนุเคราะห์ดำเนินการตั้งหนี้ครับ",
          category: "DEBT_SETUP",
          status: "PENDING",
          priority: "HIGH",
          attachmentUrl: "",
          createdAt: new Date().toISOString(),
          employee: { firstName: "พัชรี", lastName: "เภสัชกร", email: "patcharee.p@bdms.local" }
        },
        {
          ticketId: "mock-2",
          title: "ยื่นเอกสารเบิกจ่าย Petty Cash แผนกฉุกเฉิน",
          description: "ขออนุมัติเบิกจ่ายค่าวัสดุสิ้นเปลืองทางการแพทย์ฉุกเฉินจำนวน 1,850 บาท ตามใบเสร็จแนบ อนุมัติตามอำนาจดำเนินการเรียบร้อยแล้วค่ะ",
          category: "PETTY_CASH",
          status: "APPROVED",
          priority: "MEDIUM",
          attachmentUrl: JSON.stringify({
            0: "https://drive.google.com/file/d/petty-cash-emergency-form",
            1: "https://drive.google.com/file/d/petty-cash-invoice",
            2: "https://drive.google.com/file/d/petty-cash-receipt",
            3: "https://drive.google.com/file/d/petty-cash-auth",
          }),
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          employee: { firstName: "สมชาย", lastName: "รักษาดี", email: "somchai.r@bdms.local" }
        }
      ];
      setTickets(initialMockTickets);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [deptId]);

  // Stage 1: Create a PENDING Draft Ticket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a ticket title.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter request descriptions.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      description,
      category,
      priority,
      attachmentUrl: undefined,
      departmentId: deptId,
      employeeId: currentUser.email
    };

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API call failed");

      toast.success("เปิดตั๋ว PENDING สำเร็จ! กรุณาคลิกเลือกตั๋วในรายการเพื่อตรวจสอบเอกสารและส่งมอบใบเสร็จ 🔔");
      setIsModalOpen(false);
      resetForm();
      fetchTickets();
    } catch (err) {
      // Local Sandbox Fallback
      if (!isLive) {
        const newMockTicket: TicketType = {
          ticketId: Math.random().toString(),
          title,
          description,
          category,
          status: "PENDING",
          priority,
          attachmentUrl: "",
          createdAt: new Date().toISOString(),
          employee: {
            firstName: currentUser.name.split(" ")[1] || "Pattara",
            lastName: currentUser.name.split(" ")[2] || "Chen",
            email: currentUser.email
          }
        };

        setTickets(prev => [newMockTicket, ...prev]);
        toast.success("เปิดตั๋ว PENDING (Sandbox) สำเร็จ! คลิกที่ตั๋วอีกครั้งเพื่อยื่นเอกสาร 🔔");
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to submit ticket.");
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stage 2: Click ticket to manage / submit attachments
  const handleTicketClick = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    
    let initialUrls: Record<number, string> = {};
    if (ticket.attachmentUrl) {
      try {
        initialUrls = JSON.parse(ticket.attachmentUrl);
      } catch {
        initialUrls = { 0: ticket.attachmentUrl };
      }
    }
    setManageAttachmentUrls(initialUrls);
    
    const initialTypes: Record<number, "link" | "file"> = {};
    const initialChecks: Record<number, boolean> = {};
    const checklistLength = CATEGORY_CHECKLISTS[ticket.category]?.length || 0;
    
    for (let i = 0; i < checklistLength; i++) {
      const url = initialUrls[i] || "";
      initialTypes[i] = url.startsWith("[File] ") ? "file" : "link";
      initialChecks[i] = !!(url && url.trim().length > 0);
    }
    
    setManageAttachmentTypes(initialTypes);
    setManageCheckedItems(initialChecks);
    setIsManageOpen(true);
  };

  const handleToggleType = (index: number, type: "link" | "file") => {
    setManageAttachmentTypes(prev => ({ ...prev, [index]: type }));
    setManageAttachmentUrls(urls => ({ ...urls, [index]: "" }));
    setManageCheckedItems(checks => ({ ...checks, [index]: false }));
  };

  const handleAttachmentLinkChange = (index: number, val: string) => {
    setManageAttachmentUrls(prev => {
      const next = { ...prev, [index]: val };
      setManageCheckedItems(checks => ({
        ...checks,
        [index]: val.trim().length > 0
      }));
      return next;
    });
  };

  const handleSendToAccounting = async () => {
    if (!selectedTicket) return;

    const activeChecklist = CATEGORY_CHECKLISTS[selectedTicket.category] || [];
    const missingAttachmentsCount = activeChecklist.filter((_, idx) => !manageAttachmentUrls[idx] || !manageAttachmentUrls[idx].trim()).length;
    if (missingAttachmentsCount > 0) {
      toast.error(`Please provide an attachment link or file for all ${missingAttachmentsCount} required documents.`);
      return;
    }

    setIsUpdatingTicket(true);
    const serializedAttachment = JSON.stringify(manageAttachmentUrls);

    try {
      const res = await fetch(`${API_BASE}/tickets/${selectedTicket.ticketId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PROCESSING",
          attachmentUrl: serializedAttachment
        })
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("ส่งเอกสารเรียบร้อย! ระบบส่งสัญญานเตือน (Alert) ด่วนไปให้เจ้าหน้าที่แผนกบัญชี (AP Clerk) แล้วครับ 🔔");
      setIsManageOpen(false);
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      if (!isLive) {
        setTickets(prev =>
          prev.map(t =>
            t.ticketId === selectedTicket.ticketId
              ? { ...t, status: "PROCESSING", attachmentUrl: serializedAttachment }
              : t
          )
        );
        toast.success("ส่งเอกสารเรียบร้อย! ส่งสัญญานเตือน (Alert) ให้เจ้าหน้าที่แผนกบัญชีแล้ว (Sandbox) 🔔");
        setIsManageOpen(false);
        setSelectedTicket(null);
      } else {
        toast.error("Failed to update ticket.");
        console.error(err);
      }
    } finally {
      setIsUpdatingTicket(false);
    }
  };

  const handleDismissTicketById = async (ticketId: string) => {
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("ยกเลิกตั๋วเอกสารและนำออกจากระบบ BDMS เรียบร้อยแล้ว");
      fetchTickets();
    } catch (err) {
      if (!isLive) {
        setTickets(prev => prev.filter(t => t.ticketId !== ticketId));
        toast.success("ยกเลิกตั๋วเอกสารและนำออกเรียบร้อยแล้ว (Sandbox)");
      } else {
        toast.error("Failed to delete ticket.");
        console.error(err);
      }
    }
  };

  const handleDismissTicket = async () => {
    if (!selectedTicket) return;
    setIsDismissingTicket(true);
    await handleDismissTicketById(selectedTicket.ticketId);
    setIsDismissingTicket(false);
    setIsManageOpen(false);
    setSelectedTicket(null);
  };

  const renderStatus = (status: string) => {
    const maps: Record<string, string> = {
      PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
      PROCESSING: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
      CLOSED: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-200"
    };
    const cls = maps[status] || maps.PENDING;
    return (
      <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded border uppercase ${cls}`}>
        {status}
      </span>
    );
  };

  const renderPriority = (priority: string) => {
    const maps: Record<string, string> = {
      LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      MEDIUM: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
      HIGH: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      URGENT: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30 dark:text-red-400 animate-pulse font-bold"
    };
    const cls = maps[priority] || maps.MEDIUM;
    return (
      <span className={`inline-flex items-center text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider uppercase ${cls}`}>
        {priority}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Clinical & Document Tickets</h2>
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${isLive ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
              {isLive ? <Check className="h-2 w-2" /> : <AlertCircle className="h-2 w-2" />}
              {isLive ? "Live DB" : "Sandbox"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Create document submission requests. Open a pending request draft, upload files to auto-send, or dismiss them.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-xs font-semibold text-white shadow-sm cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Open New Ticket
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <span className="text-xs text-muted-foreground mt-2 font-medium">Fetching tickets...</span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-xl border border-border border-dashed p-12 text-center">
          <Inbox className="h-8 w-8 mx-auto text-muted-foreground/40 animate-pulse" />
          <p className="text-xs text-muted-foreground mt-3 font-semibold">No active tickets for this department.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          {tickets.map((t) => (
            <div
              key={t.ticketId}
              onClick={() => handleTicketClick(t)}
              className="rounded-xl border border-border bg-card p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer transition shadow-[var(--shadow-soft)] active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderStatus(t.status)}
                    {renderPriority(t.priority)}
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/80">
                      {CATEGORY_LABELS[t.category] || t.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{t.description}</p>
                </div>
                <div className="text-right text-[10px] text-muted-foreground font-semibold flex flex-col items-end gap-1.5 shrink-0 ml-auto">
                  <span className="font-mono">{t.createdAt.slice(0, 10)} {t.createdAt.slice(11, 16)}</span>
                  <div className="text-slate-600 dark:text-slate-400">
                    By: <span className="font-bold text-slate-900 dark:text-slate-200">{t.employee.firstName} {t.employee.lastName}</span>
                  </div>
                  {t.attachmentUrl && (() => {
                    try {
                      const urlMap = JSON.parse(t.attachmentUrl);
                      const totalLinks = Object.values(urlMap).filter(Boolean).length;
                      if (totalLinks === 0) return null;
                      return (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1 animate-fade-in">
                          <Check className="h-3.5 w-3.5" /> {totalLinks} Files Attached
                        </span>
                      );
                    } catch {
                      return (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1">
                          <Check className="h-3.5 w-3.5" /> Documents Attached
                        </span>
                      );
                    }
                  })()}
                  {t.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDismissConfirmId(t.ticketId);
                      }}
                      className="group/dismiss inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 dark:from-rose-950/30 dark:to-red-950/30 dark:hover:from-rose-900/40 dark:hover:to-red-900/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/50 hover:border-rose-300 dark:hover:border-rose-700 text-[10px] font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_2px_12px_rgba(244,63,94,0.15)]"
                      title="Dismiss Ticket Draft"
                    >
                      <Trash2 className="h-3 w-3 transition-transform duration-200 group-hover/dismiss:rotate-[-8deg]" />
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STAGE 1: TICKET INITIATION DIALOG (PENDING DRAFT) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden p-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-600" /> Open New Ticket Draft (Pending)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Initiate a ticket first. You will be able to check document lists and attach files once created.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Request / Document Category <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                >
                  <option value="DEBT_SETUP">เอกสารประกอบการตั้งหนี้ (Debt Setup Documents)</option>
                  <option value="PAYMENT">เอกสารประกอบการจ่ายเงิน (Payment Documents)</option>
                  <option value="TE_ADVANCE">เบิกเงินทดรองจ่าย (TE Advance Request &gt; 3,000฿)</option>
                  <option value="TE_CLEAR">เคลียร์เงินทดรอง (Clear TE Advance)</option>
                  <option value="PETTY_CASH">เบิกเงินสดย่อย (Petty Cash Claim &lt; 3,000฿)</option>
                  <option value="OTHER">งานสอบถามและบริการอื่นๆ (General Requests)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/50 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  คำชี้แจงและหลักเกณฑ์ (Instruction & Guidelines)
                </div>
                <div className="whitespace-pre-line leading-relaxed font-semibold">
                  {CATEGORY_INSTRUCTIONS[category]}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Subject / Title <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  placeholder="e.g. ขอส่งเอกสารเบิกจ่าย Petty Cash คลินิกทันตกรรมประจำรอบเดือนพฤษภา"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Detailed Descriptions & Requests <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Provide precise details, amount, reference numbers, or inquiries..."
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 text-foreground resize-y"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Urgency Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div className="flex items-center justify-center pt-4 border-t border-border mt-6 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-md w-3/4 mx-auto font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Open Ticket Draft"
                  )}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* STAGE 2: MANAGE EXISTENT TICKET (AUDIT COMPLIANCE SYSTEM) */}
      <Dialog open={isManageOpen} onOpenChange={(open) => !open && setIsManageOpen(false)}>
        <DialogContent className="max-w-xl bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden p-0 max-h-[90vh] flex flex-col">
          {selectedTicket && (
            <>
              <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-blue-600" /> Manage Ticket: {selectedTicket.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Verify mandatory documents and attach file URLs.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center gap-2">
                  {renderStatus(selectedTicket.status)}
                  {renderPriority(selectedTicket.priority)}
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/80">
                    {CATEGORY_LABELS[selectedTicket.category] || selectedTicket.category}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 dark:bg-slate-800/20 dark:border-slate-700/60 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Description</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{selectedTicket.description}</p>
                  <div className="text-[10px] text-muted-foreground pt-1 border-t border-slate-200/50 dark:border-slate-700/40 mt-2 font-medium">
                    Created by: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedTicket.employee.firstName} {selectedTicket.employee.lastName}</span> ({selectedTicket.employee.email})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/50 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    คำชี้แจงและหลักเกณฑ์ (Instruction &amp; Guidelines)
                  </div>
                  <div className="whitespace-pre-line leading-relaxed font-semibold">
                    {CATEGORY_INSTRUCTIONS[selectedTicket.category]}
                  </div>
                </div>

                {selectedTicket.status === "PENDING" ? (
                  <>
                    {/* Checklist Auditing */}
                    {(CATEGORY_CHECKLISTS[selectedTicket.category] || []).length > 0 && (
                      <div className="p-4 rounded-xl border border-blue-200/50 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/10 space-y-3">
                        <h4 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                          <ListChecks className="h-3.5 w-3.5" /> Required Audit Checklist
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-normal mb-2">Entering a link or attaching a file will auto-check the requirement with animations.</p>
                        <div className="space-y-4">
                          {(CATEGORY_CHECKLISTS[selectedTicket.category] || []).map((chk, index) => {
                            const fileLink = manageAttachmentUrls[index] || "";
                            const isTicked = fileLink.trim().length > 0;
                            const mode = manageAttachmentTypes[index] || "link";

                            return (
                              <div
                                key={index}
                                className={`space-y-2.5 p-4 rounded-2xl border transition-all duration-500 ${
                                  isTicked
                                    ? "bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/30 dark:from-emerald-950/10 dark:to-transparent dark:border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.05)] scale-[1.01]"
                                    : "bg-slate-50 border-slate-200/60 dark:bg-slate-800/20 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {/* Spring Checkmark Animation */}
                                  <div className="relative flex items-center justify-center shrink-0">
                                    {!isTicked ? (
                                      <div className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-all duration-300">
                                        <FileText className="h-3 w-3" />
                                      </div>
                                    ) : (
                                      <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-in zoom-in-75 duration-300 ease-out rotate-[360deg] transition-all">
                                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {chk.doc} <span className="text-[9px] font-mono text-slate-400">({chk.label})</span>
                                  </span>

                                  {/* Link vs File Mode Sub-Toggle */}
                                  <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300/40 dark:border-slate-700 scale-90 origin-right ml-auto shrink-0 shadow-inner">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleType(index, "link")}
                                      className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                                        mode === "link"
                                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold"
                                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                      }`}
                                    >
                                      <ExternalLink className="h-2.5 w-2.5" />
                                      Paste Link
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleType(index, "file")}
                                      className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                                        mode === "file"
                                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold"
                                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                      }`}
                                    >
                                      <Paperclip className="h-2.5 w-2.5" />
                                      Attach File
                                    </button>
                                  </div>
                                </div>

                                {/* Input based on Selected Mode */}
                                <div className="pl-7">
                                  {mode === "link" ? (
                                    <input
                                      type="text"
                                      value={fileLink}
                                      onChange={(e) => handleAttachmentLinkChange(index, e.target.value)}
                                      placeholder={`Paste URL for ${chk.label} (e.g. Google Drive link)...`}
                                      className="w-full h-8 px-2.5 rounded bg-background border border-slate-200/80 text-[11px] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 text-foreground font-medium transition"
                                    />
                                  ) : (
                                    <div>
                                      {isTicked ? (
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold animate-fade-in shadow-sm">
                                          <span className="flex items-center gap-1.5 font-medium truncate">
                                            <Paperclip className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            {fileLink.replace("[File] ", "")}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => handleAttachmentLinkChange(index, "")}
                                            className="h-5 w-5 rounded hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 grid place-items-center cursor-pointer active:scale-95 transition"
                                          >
                                            <X className="h-3 w-3 shrink-0" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleAttachmentLinkChange(index, `[File] ${chk.label}_Attachment.pdf`)}
                                          className="w-full py-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-700/80 bg-slate-50/50 hover:bg-slate-100 hover:border-blue-500 dark:hover:bg-slate-800/40 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold flex flex-col items-center justify-center gap-1 transition active:scale-[0.99] cursor-pointer shadow-inner"
                                        >
                                          <Upload className="h-3.5 w-3.5 text-slate-400 animate-pulse" />
                                          Click to attach mock {chk.label} file (PDF, PNG, JPG)
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Auto-send Compliant Glowing Banner */}
                    {(CATEGORY_CHECKLISTS[selectedTicket.category] || []).length > 0 &&
                      (CATEGORY_CHECKLISTS[selectedTicket.category] || []).filter((_, idx) => !manageAttachmentUrls[idx] || !manageAttachmentUrls[idx].trim()).length === 0 && (
                        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-500/10 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 animate-pulse shadow-sm">
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold">เอกสารแนบครบถ้วน! (Attachments Compliance Met)</span>
                            <p className="text-[10px] text-emerald-700/95 dark:text-emerald-400/90 mt-0.5 leading-relaxed">
                              คุณทำการแนบข้อมูลครบถ้วนสมบูรณ์แล้ว ระบบพร้อมกดส่งตั๋วใบนี้เปลี่ยนสถานะเป็น PROCESSING และส่งมอบให้แผนกบัญชีทันทีที่คุณกดส่งมอบ
                            </p>
                          </div>
                        </div>
                      )}
                  </>
                ) : (
                  /* Read-Only Submissions Information */
                  <div className="p-4 rounded-xl border border-emerald-200/50 bg-emerald-50/10 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-3 shadow-inner">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Submitted &amp; Audited Successfully
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                      This ticket was submitted with all checked items and attachments verified:
                    </p>
                    <div className="space-y-1.5 pt-2">
                      {(() => {
                        try {
                          const urlMap = JSON.parse(selectedTicket.attachmentUrl || "{}");
                          return Object.entries(urlMap).map(([idx, url]) => {
                            const chk = CATEGORY_CHECKLISTS[selectedTicket.category]?.[Number(idx)];
                            if (!url || !chk) return null;
                            return (
                              <a
                                key={idx}
                                href={url as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-bold bg-background p-2 rounded border border-border/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                              >
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" /> {chk.doc} — {chk.label}
                              </a>
                            );
                          });
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Centered Submit Action */}
                {selectedTicket.status === "PENDING" && (
                  <div className="flex items-center justify-center pt-4 border-t border-border mt-6 pb-2">
                    <button
                      type="button"
                      disabled={isUpdatingTicket}
                      onClick={handleSendToAccounting}
                      className="h-9 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-md w-3/4 mx-auto"
                    >
                      {isUpdatingTicket ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending...
                        </>
                      ) : (
                        "Send to Accounting"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DISMISS CONFIRMATION DIALOG */}
      <Dialog open={dismissConfirmId !== null} onOpenChange={(open) => !open && setDismissConfirmId(null)}>
        <DialogContent className="max-w-sm bg-card border border-border rounded-2xl shadow-2xl z-[60] overflow-hidden p-0">
          <div className="flex flex-col items-center text-center px-8 pt-8 pb-6 space-y-4">
            {/* Animated Warning Icon */}
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-100 to-red-50 dark:from-rose-950/40 dark:to-red-950/20 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center shadow-[0_4px_24px_rgba(244,63,94,0.12)]">
                <AlertTriangle className="h-7 w-7 text-rose-500 dark:text-rose-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                <Trash2 className="h-3 w-3" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                ยืนยันการยกเลิกตั๋ว?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[260px] mx-auto">
                ตั๋วฉบับร่าง (Draft) นี้จะถูกลบออกจากระบบ BDMS อย่างถาวร ไม่สามารถกู้คืนได้
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setDismissConfirmId(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-sm"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={isDismissingTicket}
                onClick={async () => {
                  if (!dismissConfirmId) return;
                  setIsDismissingTicket(true);
                  await handleDismissTicketById(dismissConfirmId);
                  setIsDismissingTicket(false);
                  setDismissConfirmId(null);
                }}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 disabled:opacity-50 text-white text-xs font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-[0_2px_12px_rgba(244,63,94,0.25)] hover:shadow-[0_4px_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2"
              >
                {isDismissingTicket ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" /> ยืนยัน ลบตั๋ว
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
