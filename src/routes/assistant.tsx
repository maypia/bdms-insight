import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { departments } from "@/lib/mock-data";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Bookmark,
  FileText,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string; refs?: string[] };

const sampleConvos = [
  { id: "c1", title: "เอกสารตั้งหนี้ของ AP", time: "วันนี้" },
  { id: "c2", title: "ขั้นตอนเบิก TE Advance", time: "วันนี้" },
  { id: "c3", title: "เบอร์ติดต่อ Petty Cash", time: "เมื่อวาน" },
  { id: "c4", title: "สิทธิรักษาพยาบาล HR", time: "2 วันที่แล้ว" },
];

const saved = [
  "เอกสารตั้งหนี้ต้องใช้อะไรบ้าง",
  "เบอร์ AP ติดต่ออะไร",
  "Petty Cash ใช้เอกสารอะไร",
];

const suggestions = [
  "เอกสารตั้งหนี้ต้องใช้อะไรบ้าง",
  "เบอร์ AP ติดต่ออะไร",
  "การเบิก TE Advance ต้องทำยังไง",
  "Petty Cash ใช้เอกสารอะไร",
];

function generateAnswer(q: string, deptId: string): { content: string; refs: string[] } {
  const dept = departments.find((d) => d.id === deptId);
  if (!dept) return { content: "ไม่พบข้อมูลแผนก", refs: [] };
  const ql = q.toLowerCase();
  const match = dept.faqs.find(
    (f) =>
      f.question.toLowerCase().includes(ql) ||
      ql.includes(f.category.toLowerCase()) ||
      f.tags?.some((t) => ql.includes(t.toLowerCase()))
  );
  if (match) {
    return {
      content: `${match.answer}\n\n— อ้างอิงจาก FAQ "${match.question}" หมวด ${match.category} (อัปเดต ${match.updatedAt})`,
      refs: [match.id],
    };
  }
  return {
    content: `ขออภัยค่ะ ยังไม่พบคำตอบที่ตรงในฐานข้อมูลของแผนก ${dept.name}\n\nลองถามคำถามที่เฉพาะเจาะจงขึ้น เช่น "เอกสารตั้งหนี้" หรือ "TE Advance" หรือกดที่คำถามแนะนำด้านล่างค่ะ`,
    refs: [],
  };
}

function AssistantPage() {
  const [deptId, setDeptId] = useState("ap");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "สวัสดีค่ะ ฉันคือผู้ช่วย AI ของ BDMS — ถามได้เลยเกี่ยวกับขั้นตอนการทำงาน เอกสาร หรือเบอร์ติดต่อของแผนกที่คุณเลือกค่ะ",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const dept = useMemo(() => departments.find((d) => d.id === deptId)!, [deptId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const userMsg: Msg = { role: "user", content: q };
    const ans = generateAnswer(q, deptId);
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: ans.content, refs: ans.refs }]);
    setInput("");
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_300px] gap-5 h-[calc(100vh-8rem)]">
        {/* Left sidebar */}
        <aside className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Department
            </label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} — {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3">
            <button
              onClick={() => setMessages([{ role: "assistant", content: "เริ่มบทสนทนาใหม่ — ถามได้เลยค่ะ" }])}
              className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> New chat
            </button>
          </div>

          <div className="px-2 flex-1 overflow-y-auto">
            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground px-3 py-2 uppercase">
              Recent
            </div>
            <ul className="space-y-0.5">
              {sampleConvos.map((c) => (
                <li key={c.id}>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted transition group">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm truncate text-foreground">{c.title}</div>
                        <div className="text-[10px] text-muted-foreground">{c.time}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground px-3 py-2 uppercase mt-3">
              Saved
            </div>
            <ul className="space-y-0.5">
              {saved.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => send(s)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted transition flex items-start gap-2"
                  >
                    <Bookmark className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{s}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center chat */}
        <section className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] flex flex-col overflow-hidden">
          <header className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.5_0.18_255)] text-primary-foreground grid place-items-center shadow-[var(--shadow-glow)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">BDMS Assistant</div>
              <div className="text-xs text-muted-foreground">
                ตอบคำถามเกี่ยวกับ <span className="text-primary font-medium">{dept.name}</span>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-primary-soft text-primary grid place-items-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-surface-muted text-foreground rounded-bl-md border border-border"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {messages.length <= 1 && (
              <div className="pt-4">
                <div className="text-xs font-medium text-muted-foreground mb-3">คำถามแนะนำ</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-sm rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-primary-soft/40 transition p-3 flex items-center justify-between gap-2 group"
                    >
                      <span className="text-foreground">{s}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 rounded-2xl border border-border bg-surface focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30 transition p-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder={`ถามเกี่ยวกับ ${dept.name}…`}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm focus:outline-none placeholder:text-muted-foreground max-h-32"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-9 w-9 grid place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-95 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="text-[11px] text-muted-foreground mt-2 px-1">
              คำตอบสร้างจากฐานความรู้ภายใน BDMS · กด Enter เพื่อส่ง · Shift+Enter เพื่อขึ้นบรรทัดใหม่
            </div>
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-y-auto">
          <div className="p-5 border-b border-border">
            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">
              Department
            </div>
            <div className="font-semibold">{dept.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{dept.description}</div>
          </div>

          <div className="p-5 border-b border-border">
            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              Quick contacts
            </div>
            {dept.contacts.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">ไม่มีข้อมูลติดต่อ</div>
            ) : (
              <ul className="space-y-3">
                {dept.contacts.slice(0, 3).map((c) => (
                  <li key={c.id} className="text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">{c.role}</div>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                      <Phone className="h-3 w-3 text-muted-foreground" />{c.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                      <Mail className="h-3 w-3 text-muted-foreground" />{c.email}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-5">
            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
              Reference documents
            </div>
            {dept.attachments.length === 0 && dept.documents.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">ยังไม่มีเอกสารอ้างอิง</div>
            ) : (
              <ul className="space-y-2">
                {[...dept.attachments, ...dept.documents.slice(0, 3)].map((a: any) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-muted transition cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary-soft text-primary grid place-items-center">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-sm flex-1 min-w-0 truncate">{a.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
