import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { departments as mockDepartments, currentUser } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Filter,
  Tag,
  Clock,
  Pencil,
  Trash2,
  HelpCircle,
  Upload,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  X,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/knowledge")({
  component: KnowledgePage,
});

type Article = {
  articleId: string;
  title: string;
  content: string;
  contentType: string;
  category: string;
  tags: string[];
  departmentId: string;
  sourceFileUrl?: string | null;
  updatedAt: string;
  department: {
    departmentId: string;
    departmentName: string;
  };
};

const API_BASE = "http://localhost:3001/api";

function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  // Search & Filters state
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "upload">("write");
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("FAQ");
  const [contentType, setContentType] = useState("MARKDOWN");
  const [content, setContent] = useState("");
  const [departmentId, setDepartmentId] = useState("ap");
  const [tagsInput, setTagsInput] = useState("");
  const [sourceFileUrl, setSourceFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch articles from Elysia API
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/articles`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setArticles(data);
      setIsLive(true);
    } catch (err) {
      console.warn("Backend offline, falling back to mock data.", err);
      setIsLive(false);
      // Map mock FAQ data to fit our Article schema for seamless mock experience
      const mockArticles = mockDepartments.flatMap((d) =>
        d.faqs.map((f) => ({
          articleId: f.id,
          title: f.question,
          content: f.answer,
          contentType: "MARKDOWN",
          category: f.category.toUpperCase(),
          tags: f.tags || [],
          departmentId: d.id,
          updatedAt: f.updatedAt,
          department: {
            departmentId: d.id,
            departmentName: d.name,
          },
        }))
      );
      setArticles(mockArticles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filtered Articles listing
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (deptFilter !== "all" && a.departmentId !== deptFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, deptFilter, query]);

  const selectedDeptLabel = useMemo(() => {
    if (deptFilter === "all") return "All Departments";
    const dept = mockDepartments.find((d) => d.id === deptFilter);
    return dept ? dept.name : "All Departments";
  }, [deptFilter]);

  // Handle docx parsing
  const handleDocxUpload = async (file: File) => {
    if (!file) return;
    setIsParsing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/articles/parse-docx`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Parsing failed");
      const data = await res.json();

      // Autofill fields and switch to write tab
      setTitle(data.title || file.name.replace(/\.[^/.]+$/, ""));
      setContent(data.html || data.text || "");
      setContentType("HTML");
      setActiveTab("write");
      toast.success("Document parsed successfully! Review your content below.");
    } catch (err) {
      toast.error("Failed to parse DOCX. Ensure the Elysia server is active.");
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDocxUpload(e.dataTransfer.files[0]);
    }
  };

  // Submit new/edited article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Input Validations
    if (!title.trim()) {
      toast.error("Article Title is required.");
      return;
    }
    if (title.length > 100) {
      toast.error("Article Title cannot exceed 100 characters.");
      return;
    }
    if (!content.trim()) {
      toast.error("Article Content is required.");
      return;
    }
    if (content.length > 10000) {
      toast.error("Article Content cannot exceed 10,000 characters.");
      return;
    }

    setIsSubmitting(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    if (tags.length > 5) {
      toast.error("Maximum 5 tags are allowed.");
      return;
    }

    const payload = {
      title,
      content,
      contentType,
      category,
      tags,
      departmentId,
      authorId: currentUser.email,
      sourceFileUrl: sourceFileUrl || undefined,
    };

    try {
      let res;
      if (editId) {
        // Edit Mode
        res = await fetch(`${API_BASE}/articles/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create Mode
        res = await fetch(`${API_BASE}/articles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("API call failed");

      toast.success(editId ? "Article updated successfully!" : "Article published successfully!");
      setIsModalOpen(false);
      resetForm();
      fetchArticles();
    } catch (err) {
      // Mock mode fallback logic
      if (!isLive) {
        if (editId) {
          setArticles((prev) =>
            prev.map((a) =>
              a.articleId === editId
                ? {
                    ...a,
                    title,
                    content,
                    contentType,
                    category,
                    tags,
                    departmentId,
                    updatedAt: new Date().toISOString().split("T")[0],
                  }
                : a
            )
          );
          toast.success("Updated in Local Sandbox mode.");
        } else {
          const newMock: Article = {
            articleId: Math.random().toString(),
            title,
            content,
            contentType,
            category,
            tags,
            departmentId,
            updatedAt: new Date().toISOString().split("T")[0],
            department: {
              departmentId,
              departmentName: mockDepartments.find((d) => d.id === departmentId)?.name || "",
            },
          };
          setArticles((prev) => [newMock, ...prev]);
          toast.success("Created in Local Sandbox mode.");
        }
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save article. Elysia backend error.");
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Edit modal
  const handleEditClick = (art: Article) => {
    setEditId(art.articleId);
    setTitle(art.title);
    setContent(art.content);
    setContentType(art.contentType);
    setCategory(art.category);
    setDepartmentId(art.departmentId);
    setTagsInput(art.tags.join(", "));
    setSourceFileUrl(art.sourceFileUrl || "");
    setActiveTab("write");
    setIsModalOpen(true);
  };

  // Trigger Delete confirmation
  const handleDeleteClick = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/articles/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Article deleted successfully.");
      setDeleteId(null);
      fetchArticles();
    } catch (err) {
      if (!isLive) {
        setArticles((prev) => prev.filter((a) => a.articleId !== deleteId));
        toast.success("Removed in Local Sandbox mode.");
        setDeleteId(null);
      } else {
        toast.error("Failed to delete article.");
        console.error(err);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setContent("");
    setContentType("MARKDOWN");
    setCategory("FAQ");
    setDepartmentId("ap");
    setTagsInput("");
    setSourceFileUrl("");
    setActiveTab("write");
  };

  return (
    <AppLayout>
      {/* Top Banner and Status Indicator */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Knowledge Base</h1>
            <span
              className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isLive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
              }`}
            >
              {isLive ? <Check className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />}
              {isLive ? "Elysia Connected" : "Local Sandbox Mode"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Cross-departmental wikis, hospital SOP guidelines, and frequently asked clinical questions
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-xs font-semibold shadow-sm cursor-pointer"
        >
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
            placeholder="Search clinical questions, answers, tags or SOPs..."
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
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
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
                  {mockDepartments.map((d) => (
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
          {filteredArticles.length} articles found
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="text-xs text-muted-foreground mt-4 font-semibold">Loading knowledge entries...</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-16 text-center animate-fade-in">
          <HelpCircle className="h-9 w-9 mx-auto text-muted-foreground/50 animate-pulse" />
          <p className="text-xs text-muted-foreground mt-3 font-semibold">No SOP articles found matching your criteria.</p>
        </div>
      ) : (
        /* Bento Grid Clinical Articles */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredArticles.map((a, index) => {
            const delayClasses = ["", "animation-delay-100", "animation-delay-200", "animation-delay-300", "animation-delay-400"];
            const delayClass = delayClasses[index % delayClasses.length];
            return (
              <article
                key={a.articleId}
                className={`group rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md border-l-2 border-l-transparent hover:border-l-blue-500 transition-all duration-200 animate-fade-in-up ${delayClass}`}
              >
                {/* Meta details */}
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="text-[9px] font-bold font-mono text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-border bg-slate-50 dark:bg-slate-800 uppercase">
                    {a.department.departmentId.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {a.category}
                  </span>
                </div>

                {/* Question / Title */}
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {a.title}
                </h3>

                {/* Answer snippet */}
                {a.contentType === "HTML" ? (
                  <div
                    className="text-xs text-muted-foreground mt-2.5 line-clamp-3 leading-relaxed HTML-rendered-content"
                    dangerouslySetInnerHTML={{ __html: a.content }}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground mt-2.5 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {a.content}
                  </p>
                )}

                {/* Footer and Actions */}
                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-border/60">
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {a.updatedAt.slice(0, 10)}
                    </span>
                    {a.tags && a.tags.length > 0 && (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {a.tags.join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditClick(a)}
                      className="h-7 w-7 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(a.articleId)}
                      className="h-7 w-7 grid place-items-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* CREATE & EDIT ARTICLE MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden p-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-border flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {editId ? "Edit Article" : "Create New Knowledge Article"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Draft a new FAQ, clinical procedure SOP, or policy guideline for hospital clinics
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Dialog Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Tab Toggles (Manual vs Import) */}
            {!editId && (
              <div className="flex bg-slate-100/50 dark:bg-slate-800/40 p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "write"
                      ? "bg-card text-slate-900 dark:text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Write Manually
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "upload"
                      ? "bg-card text-slate-900 dark:text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Import Word (.docx)
                </button>
              </div>
            )}

            {activeTab === "upload" && !editId ? (
              /* DOCX Dropzone */
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer transition bg-slate-50/10 dark:bg-slate-800/5 hover:bg-slate-50/30 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleDocxUpload(e.target.files[0])}
                  accept=".docx"
                  className="hidden"
                />
                {isParsing ? (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Reading Word document and extracting HTML...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                        Drag and drop your .docx Word file here
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1 block">
                        Or click to browse files from your computer
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Editor Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Category <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="FAQ">FAQ / Clinical Q&A</option>
                      <option value="SOP">SOP Procedure</option>
                      <option value="POLICY">Hospital Policy</option>
                      <option value="MEMO">Internal Announcement</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Department <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      {mockDepartments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} — {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Article Title <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <span className={`text-[10px] font-semibold font-mono ${title.length > 100 ? "text-red-500 font-bold animate-pulse" : "text-slate-400"}`}>
                      {title.length}/100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    placeholder="e.g., Accounts Payable Petty Cash Reimbursement SOP"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 text-foreground"
                  />
                </div>

                {/* Content Type Selector */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Content Format
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="contentType"
                        value="MARKDOWN"
                        checked={contentType === "MARKDOWN"}
                        onChange={() => setContentType("MARKDOWN")}
                        className="h-3.5 w-3.5 text-blue-600 focus:ring-0 focus:ring-offset-0"
                      />
                      Markdown / Plain Text
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="contentType"
                        value="HTML"
                        checked={contentType === "HTML"}
                        onChange={() => setContentType("HTML")}
                        className="h-3.5 w-3.5 text-blue-600 focus:ring-0 focus:ring-offset-0"
                      />
                      HTML Formatting
                    </label>
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Article Content <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <span className={`text-[10px] font-semibold font-mono ${content.length > 10000 ? "text-red-500 font-bold animate-pulse" : "text-slate-400"}`}>
                      {content.length.toLocaleString()}/10,000
                    </span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    maxLength={10000}
                    placeholder={
                      contentType === "MARKDOWN"
                        ? "# Header\nProvide rich markdown standard operating details here..."
                        : "<p>Provide rich structured HTML content details here...</p>"
                    }
                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 text-foreground resize-y"
                  />
                </div>

                {/* Tags and Attachment URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Search Tags (Comma-separated)
                      </label>
                      <span className={`text-[10px] font-semibold font-mono ${tagsInput.split(",").map(t => t.trim()).filter(Boolean).length > 5 ? "text-red-500 font-bold animate-pulse" : "text-slate-400"}`}>
                        {tagsInput.split(",").map(t => t.trim()).filter(Boolean).length}/5
                      </span>
                    </div>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g., reimbursement, petty cash, finance"
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Source Document File URL Link
                    </label>
                    <input
                      type="text"
                      value={sourceFileUrl}
                      onChange={(e) => setSourceFileUrl(e.target.value)}
                      placeholder="e.g., https://drive.google.com/..."
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 text-foreground"
                    />
                  </div>
                </div>

                {/* Dialog Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-9 px-4 rounded-lg border border-border bg-background text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold transition flex items-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Saving...
                      </>
                    ) : editId ? (
                      "Update Article"
                    ) : (
                      "Publish Article"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-md bg-card border border-border rounded-2xl shadow-xl z-50 p-6">
          <DialogHeader className="flex flex-col gap-2 items-center text-center">
            <div className="h-11 w-11 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Delete Knowledge Article
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete this article? This action cannot be undone and the document will be permanently removed from the hospital knowledge base database.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-2.5 mt-6 pt-4 border-t border-border/80">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 h-9 rounded-lg border border-border bg-background text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 text-xs font-semibold transition active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex-1 h-9 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-semibold transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
