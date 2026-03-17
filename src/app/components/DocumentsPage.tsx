import { useState, useRef, useEffect } from "react";
import {
  Upload, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye, Trash2,
  Search, Shield, FolderOpen, Plus, X, Send, Users, ChevronDown, RefreshCw,
  FileCheck, FileClock, FileX, Filter, UserCheck, ClipboardList, Inbox, Printer,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function useStorage<T>(key: string, std: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, setVal] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : std;
    } catch { return std; }
  });
  const setter: React.Dispatch<React.SetStateAction<T>> = (newVal) => {
    setVal(newVal);
    if (newVal instanceof Function) window.localStorage.setItem(key, JSON.stringify(newVal(val)));
    else window.localStorage.setItem(key, JSON.stringify(newVal));
  };
  return [val, setter];
}

/* ─── Types ─────────────────────────────────────────────────────────── */
interface StudentDoc {
  id: number;
  name: string;
  fileName: string;
  category: string;
  required: boolean;
  status: "verified" | "pending" | "not-uploaded" | "rejected";
  uploadedAt: string;
  size: string;
  color: string;
  icon: string;
  description: string;
  rejectionReason?: string;
}

interface DocRequest {
  id: number;
  docName: string;
  category: string;
  targetYear: string;
  targetDept: string;
  deadline: string;
  note: string;
  createdAt: string;
}

interface Submission {
  id: number;
  studentName: string;
  rollNo: string;
  department: string;
  docName: string;
  fileName: string;
  uploadedAt: string;
  size: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

/* ─── Initial data ────────────────────────────────────────────────────── */
const INITIAL_DOCS: StudentDoc[] = [
  { id: 1, name: "10th Mark Sheet", fileName: "10th_Mark_Sheet.pdf", category: "Academic", required: true, status: "verified", uploadedAt: "Jan 10, 2026", size: "1.2 MB", color: "#5540DE", icon: "📄", description: "SSLC / 10th Standard Board Mark Sheet" },
  { id: 2, name: "12th Mark Sheet", fileName: "12th_Mark_Sheet.pdf", category: "Academic", required: true, status: "verified", uploadedAt: "Jan 10, 2026", size: "0.9 MB", color: "#5540DE", icon: "📄", description: "HSC / 12th Standard Board Mark Sheet" },
  { id: 3, name: "TNEA Allotment Letter", fileName: "TNEA_Allotment.pdf", category: "Admission", required: true, status: "verified", uploadedAt: "Jan 12, 2026", size: "0.3 MB", color: "#059669", icon: "📋", description: "TNEA Seat Allotment & Admission Letter" },
  { id: 4, name: "Transfer Certificate (TC)", fileName: "TC_Certificate.pdf", category: "Admission", required: true, status: "pending", uploadedAt: "Feb 5, 2026", size: "0.5 MB", color: "#059669", icon: "📃", description: "Transfer Certificate from previous institution" },
  { id: 5, name: "Aadhar Card", fileName: "Aadhar_Card.pdf", category: "Identity", required: true, status: "pending", uploadedAt: "Jan 15, 2026", size: "0.4 MB", color: "#0891B2", icon: "🪪", description: "Government-issued Aadhar identification card" },
  { id: 6, name: "College ID Card", fileName: "", category: "Identity", required: true, status: "not-uploaded", uploadedAt: "", size: "", color: "#0891B2", icon: "🎓", description: "BIT Sathy student ID card copy" },
  { id: 7, name: "Community Certificate", fileName: "", category: "Government", required: false, status: "not-uploaded", uploadedAt: "", size: "", color: "#7C3AED", icon: "📜", description: "Community / Caste Certificate (if applicable)" },
  { id: 8, name: "Income Certificate", fileName: "", category: "Government", required: false, status: "not-uploaded", uploadedAt: "", size: "", color: "#7C3AED", icon: "📜", description: "Family income certificate for scholarship" },
  { id: 9, name: "Passport Size Photo", fileName: "Photo_Passport.jpg", category: "Identity", required: true, status: "verified", uploadedAt: "Jan 10, 2026", size: "0.2 MB", color: "#0891B2", icon: "📸", description: "Recent passport-size photograph (white background)" },
  { id: 10, name: "Anti-Ragging Undertaking", fileName: "AntiRag_Form.pdf", category: "Compliance", required: true, status: "rejected", uploadedAt: "Jan 11, 2026", size: "0.3 MB", color: "#B45309", icon: "✅", description: "Signed anti-ragging undertaking form", rejectionReason: "Document is blurry. Please re-upload a clearer scan." },
];

const INITIAL_REQUESTS: DocRequest[] = [
  { id: 1, docName: "Bonafide Certificate Request", category: "Certificates", targetYear: "All", targetDept: "All", deadline: "Mar 15, 2026", note: "Submit signed physical copy along with digital upload.", createdAt: "Feb 20, 2026" },
  { id: 2, docName: "No Due Certificate", category: "Certificates", targetYear: "4th Year", targetDept: "All", deadline: "Mar 31, 2026", note: "Required for graduation clearance.", createdAt: "Feb 22, 2026" },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  { id: 1, studentName: "Vishal S", rollNo: "21CS001", department: "CSE", docName: "10th Mark Sheet", fileName: "Vishal_10th.pdf", uploadedAt: "Feb 18, 2026", size: "1.1 MB", status: "pending" },
  { id: 2, studentName: "Priya R", rollNo: "21EC045", department: "ECE", docName: "12th Mark Sheet", fileName: "Priya_12th.pdf", uploadedAt: "Feb 19, 2026", size: "0.8 MB", status: "pending" },
  { id: 3, studentName: "Karthik M", rollNo: "21ME032", department: "MECH", docName: "Aadhar Card", fileName: "Karthik_Aadhar.pdf", uploadedAt: "Feb 17, 2026", size: "0.5 MB", status: "verified" },
];

const COLLEGE_FORMS = [
  { name: "Leave Application", icon: "📝", color: "#5540DE" },
  { name: "OD Application", icon: "📋", color: "#059669" },
  { name: "No Due Certificate", icon: "✅", color: "#0891B2" },
  { name: "Bonafide Request", icon: "📄", color: "#7C3AED" },
  { name: "TC Application", icon: "📃", color: "#D97706" },
  { name: "Medical Leave Form", icon: "🏥", color: "#DC2626" },
];

const CATEGORIES = ["All", "Academic", "Admission", "Identity", "Government", "Health", "Compliance"];
const STATUS_CONFIG = {
  "verified": { label: "Verified", bg: "rgba(5,150,105,0.1)", color: "#059669", icon: <CheckCircle2 size={13} /> },
  "pending": { label: "Under Review", bg: "rgba(217,119,6,0.1)", color: "#D97706", icon: <Clock size={13} /> },
  "not-uploaded": { label: "Not Uploaded", bg: "rgba(85,64,222,0.1)", color: "#5540DE", icon: <Upload size={13} /> },
  "rejected": { label: "Rejected", bg: "rgba(220,38,38,0.1)", color: "#DC2626", icon: <FileX size={13} /> },
};

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bento-card rounded-[2.5rem] ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ─── STUDENT VIEW ──────────────────────────────────────────────────── */
function StudentDocuments() {
  const { user } = useAuth();

  const [savedSubmissions, setSavedSubmissions] = useStorage<Submission[]>("bit_document_submissions", INITIAL_SUBMISSIONS);

  const [documents, setDocuments] = useState<StudentDoc[]>(() => {
    const mySubs = savedSubmissions.filter((s: any) => s.rollNo === user?.rollNo || s.studentName === user?.name);
    return INITIAL_DOCS.map(doc => {
      const sub = mySubs.find((s: any) => s.docName === doc.name);
      if (sub) {
        return { ...doc, subId: sub.id, status: sub.status, fileName: sub.fileName, size: sub.size, rejectionReason: sub.rejectionReason, uploadedAt: sub.uploadedAt };
      }
      return doc;
    });
  });

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [viewingDoc, setViewingDoc] = useState<StudentDoc | null>(null);
  const [filter, setFilter] = useState<"all" | "required" | "pending" | "verified" | "rejected">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mySubs = savedSubmissions.filter((s: any) => s.rollNo === user?.rollNo || s.studentName === user?.name);
    setDocuments(INITIAL_DOCS.map(doc => {
      const sub = mySubs.find((s: any) => s.docName === doc.name);
      if (sub) return { ...doc, subId: sub.id, status: sub.status, fileName: sub.fileName, size: sub.size, rejectionReason: sub.rejectionReason, uploadedAt: sub.uploadedAt };
      return doc;
    }));
  }, [savedSubmissions, user]);

  const handleUpload = (id: number) => { setUploadingFor(id); fileInputRef.current?.click(); };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || uploadingFor === null) return;

    // Find doc
    const doc = documents.find(d => d.id === uploadingFor);
    if (!doc) return;

    const payload: Submission = {
      id: (doc as any).subId || Date.now(),
      studentName: user?.name || "Unknown",
      rollNo: user?.rollNo || "Unknown",
      department: user?.department || "CSE",
      docName: doc.name,
      fileName: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      status: "pending",
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    setSavedSubmissions(prev => {
      const existing = prev.findIndex(s => s.id === payload.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = payload;
        return next;
      }
      return [...prev, payload];
    });

    setUploadingFor(null); e.target.value = "";
  };

  const remove = (id: number) => {
    const doc = documents.find(d => d.id === id);
    if (doc && (doc as any).subId) {
      setSavedSubmissions(prev => prev.filter(s => s.id !== (doc as any).subId));
    }
  };

  const filtered = documents.filter(d => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase());
    const mc = selectedCat === "All" || d.category === selectedCat;
    const mf = filter === "all" || (filter === "required" && d.required) || d.status === filter;
    return ms && mc && mf;
  });
  const stats = {
    total: documents.length, uploaded: documents.filter(d => d.status !== "not-uploaded").length,
    verified: documents.filter(d => d.status === "verified").length,
    pending: documents.filter(d => d.status === "pending").length,
    rejected: documents.filter(d => d.status === "rejected").length,
    required: documents.filter(d => d.required).length,
    requiredDone: documents.filter(d => d.required && d.status !== "not-uploaded").length,
  };
  const progress = stats.required > 0 ? Math.round((stats.requiredDone / stats.required) * 100) : 0;

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 mb-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div>
            <p className="text-indigo-200 text-xs mb-2 tracking-[0.2em] font-bold uppercase">My Document Vault</p>
            <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>My Documents</h1>
            <p className="text-indigo-100/90 text-sm font-medium">Upload and track all your required admission documents securely.</p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${progress * 2.136} 213.6`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white text-lg" style={{ fontWeight: 800, lineHeight: 1 }}>{progress}%</span>
                <span className="text-white/60 text-[9px]" style={{ fontWeight: 500 }}>Done</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-sm" style={{ fontWeight: 700 }}>{stats.requiredDone}/{stats.required}</p>
              <p className="text-white/60 text-xs">Required</p>
              {stats.rejected > 0 && (<><p className="text-red-300 text-sm mt-1" style={{ fontWeight: 700 }}>{stats.rejected}</p><p className="text-red-300/70 text-xs">Rejected</p></>)}
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl z-0" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Total", v: stats.total, c: "#5540DE", e: "📁" },
          { l: "Verified", v: stats.verified, c: "#059669", e: "✅" },
          { l: "Under Review", v: stats.pending, c: "#D97706", e: "⏳" },
          { l: "Rejected", v: stats.rejected, c: "#DC2626", e: "❌" },
        ].map(s => (
          <div key={s.l} className="bento-card-strong rounded-[2.5rem] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-xl shrink-0 shadow-sm" style={{ background: `${s.c}12` }}>{s.e}</div>
            <div>
              <p className="text-2xl" style={{ fontWeight: 800, color: s.c }}>{s.v}</p>
              <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rejection alert */}
      {stats.rejected > 0 && (
        <div className="rounded-2xl p-4 flex items-start gap-3 mb-5" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
          <FileX size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-600 text-sm" style={{ fontWeight: 600 }}>{stats.rejected} document{stats.rejected > 1 ? "s were" : " was"} rejected by admin</p>
            <p className="text-red-500 text-xs mt-0.5">Please re-upload with corrections. Check the reason shown on each rejected document.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-52 rounded-[1.5rem] px-5 py-3 bento-card shadow-sm transition-all focus-within:shadow-md">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…" className="flex-1 bg-transparent outline-none text-sm font-medium text-[var(--foreground)]" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {(["all", "required", "pending", "verified", "rejected"] as const).map(k => (
              <button key={k} onClick={() => setFilter(k)}
                className="px-4 py-2 rounded-[1rem] text-xs capitalize transition-all font-semibold"
                style={{ background: filter === k ? "#5540DE" : "var(--glass-bg)", color: filter === k ? "white" : "var(--muted-foreground)", fontWeight: filter === k ? 600 : 500, border: `1px solid ${filter === k ? "transparent" : "var(--glass-border)"}` }}>
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)}
              className="px-3 py-1.5 rounded-full text-xs transition-all"
              style={{ background: selectedCat === cat ? "#5540DE" : "var(--glass-bg)", color: selectedCat === cat ? "white" : "var(--muted-foreground)", fontWeight: selectedCat === cat ? 600 : 400, border: `1px solid ${selectedCat === cat ? "transparent" : "var(--glass-border)"}` }}>
              {cat}
            </button>
          ))}
          <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>{filtered.length} documents</span>
        </div>
      </div>

      {/* Missing required docs warning */}
      {stats.requiredDone < stats.required && (
        <div className="rounded-2xl p-4 flex items-start gap-3 mb-5" style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.25)" }}>
          <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-700 text-sm" style={{ fontWeight: 600 }}>{stats.required - stats.requiredDone} required doc(s) still needed</p>
            <p className="text-amber-600 text-xs mt-0.5">Upload before deadline. Missing documents may delay admission verification.</p>
          </div>
        </div>
      )}

      {/* Document Cards */}
      <div className="flex flex-col gap-3 mb-8">
        {filtered.map(doc => {
          const sc = STATUS_CONFIG[doc.status];
          return (
            <GlassCard key={doc.id} className="overflow-hidden">
              {doc.status === "rejected" && <div className="h-0.5 bg-gradient-to-r from-red-500 to-red-300" />}
              {doc.status === "verified" && <div className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-300" />}
              <div className="flex items-center gap-4 p-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${doc.color}12` }}>{doc.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm truncate" style={{ fontWeight: 600, color: "var(--foreground)" }}>{doc.name}</p>
                    {doc.required && <span className="text-red-500 text-[10px] shrink-0 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(220,38,38,0.1)", fontWeight: 700 }}>Required</span>}
                  </div>
                  <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{doc.description}</p>
                  {doc.status !== "not-uploaded" && (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{doc.fileName}</span>
                      {doc.size && <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{doc.size}</span>}
                      {doc.uploadedAt && <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{doc.uploadedAt}</span>}
                    </div>
                  )}
                  {doc.status === "rejected" && doc.rejectionReason && (
                    <div className="mt-1.5 px-2.5 py-1.5 rounded-lg inline-flex items-start gap-1.5" style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)" }}>
                      <FileX size={11} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-600 text-[11px]">{doc.rejectionReason}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: sc.bg, color: sc.color, fontWeight: 600 }}>
                    {sc.icon}{sc.label}
                  </span>
                  {doc.status === "not-uploaded" || doc.status === "rejected" ? (
                    <button onClick={() => handleUpload(doc.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs hover:opacity-90 transition-opacity"
                      style={{ background: doc.status === "rejected" ? "#DC2626" : "#5540DE", fontWeight: 600 }}>
                      <Upload size={12} />{doc.status === "rejected" ? "Re-upload" : "Upload"}
                    </button>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => setViewingDoc(doc)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/40 shadow-sm" style={{ background: "var(--surface-inset)" }} title="View">
                        <Eye size={14} style={{ color: "var(--foreground)" }} />
                      </button>
                      {doc.status !== "verified" && (
                        <button onClick={() => handleUpload(doc.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/40 shadow-sm" style={{ background: "var(--surface-inset)" }} title="Replace">
                          <RefreshCw size={13} className="text-[#5540DE]" />
                        </button>
                      )}
                      {doc.status !== "verified" && (
                        <button onClick={() => remove(doc.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-100 shadow-sm" title="Remove">
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
            <div className="text-4xl mb-3">📂</div>
            <p className="text-sm">No documents found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Downloadable Forms */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full" style={{ background: "#5540DE" }} />
          <h3 className="text-base" style={{ fontWeight: 700, color: "var(--foreground)" }}>Downloadable Forms</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {COLLEGE_FORMS.map(form => (
            <button key={form.name} className="bento-card-strong rounded-[2rem] p-5 flex flex-col items-center gap-3 text-center hover:-translate-y-1 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-3xl mb-1 shadow-sm bg-[var(--surface-inset)]" style={{ border: "1px solid var(--bento-border)" }}>{form.icon}</div>
              <p className="text-sm leading-tight" style={{ fontWeight: 700, color: "var(--foreground)" }}>{form.name}</p>
              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full group-hover:text-white transition-all" style={{ background: `${form.color}12`, color: form.color, fontWeight: 600 }}>
                <Download size={9} /> PDF
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="rounded-[2.5rem] p-8 bento-card-strong shadow-2xl relative overflow-hidden text-white border-none" style={{ background: "linear-gradient(135deg, #1a0a3a 0%, #2d1060 100%)" }}>
        <div className="relative z-10 flex items-start gap-4">
          <Shield size={24} className="text-purple-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm" style={{ fontWeight: 700 }}>Document Guidelines</p>
            <ul className="text-white/70 text-xs mt-2 space-y-1">
              <li>• Accepted formats: PDF, JPG, PNG (max 5 MB per file)</li>
              <li>• Documents are reviewed within 3–5 working days</li>
              <li>• Rejected documents will show the reason — re-upload after correcting</li>
              <li>• For help: <a href="https://supportdesk.bitsathy.ac.in" target="_blank" rel="noopener noreferrer" className="text-white/90 underline">supportdesk.bitsathy.ac.in</a></li>
            </ul>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onFileSelected} />

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ background: "rgba(10, 5, 25, 0.65)", backdropFilter: "blur(12px)" }}>
          <div className="rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 w-full max-w-4xl h-[85vh] border border-white/20"
            style={{ background: "rgba(255, 255, 255, 0.95)" }}>

            {/* Header */}
            <div className="relative px-6 py-5 flex items-center justify-between z-10" style={{ background: "linear-gradient(90deg, #1a0a3a 0%, #3e267d 100%)" }}>
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10" style={{ background: "rgba(255,255,255,0.1)" }}>
                  {viewingDoc.icon}
                </div>
                <div>
                  <h3 className="text-lg" style={{ fontWeight: 800 }}>{viewingDoc.name}</h3>
                  <div className="flex items-center gap-3 text-xs mt-0.5 text-white/75">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", fontWeight: 600 }}>{viewingDoc.fileName}</span>
                    <span>{viewingDoc.size}</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>Uploaded {viewingDoc.uploadedAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm hover:bg-white/15 transition-all outline-none" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <Download size={15} /> Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm hover:bg-white/15 transition-all outline-none" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <Printer size={15} /> Print
                </button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button onClick={() => setViewingDoc(null)} className="p-2 rounded-xl hover:bg-white/20 text-white transition-all outline-none">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Viewer Content (Simulated) */}
            <div className="flex-1 bg-gray-100/50 p-6 overflow-y-auto flex items-center justify-center relative">
              <div className="w-full max-w-2xl bg-white shadow-xl rounded-sm p-12 min-h-[800px] border border-gray-200">

                {/* Simulated Document Template */}
                <div className="flex justify-between items-start mb-12 border-b-2 border-gray-200 pb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">🏢</div>
                    <div>
                      <h4 className="text-lg text-gray-800 font-bold uppercase tracking-widest">{viewingDoc.category} DOCUMENT</h4>
                      <p className="text-xs text-gray-500 font-mono mt-1">Ref ID: DOC-{user?.rollNo}-{viewingDoc.id}-2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">Bannari Amman Institute of Technology</p>
                    <p className="text-xs text-gray-500 mt-1">Sathyamangalam, Erode - 638401</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{viewingDoc.name}</h2>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase font-bold">Student Name</p>
                      <p className="text-sm font-medium text-gray-900 pb-2 border-b border-gray-100">{user?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase font-bold">Roll Number</p>
                      <p className="text-sm font-medium text-gray-900 pb-2 border-b border-gray-100">{user?.rollNo}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase font-bold">Department</p>
                      <p className="text-sm font-medium text-gray-900 pb-2 border-b border-gray-100">{user?.department}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase font-bold">Submission Status</p>
                      <p className="text-sm font-medium text-gray-900 pb-2 border-b border-gray-100 capitalize">{viewingDoc.status}</p>
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">{viewingDoc.fileName}</p>
                      <p className="text-gray-400 text-xs mt-2">Document content preview is simulated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Footer */}
            {viewingDoc.status === "verified" && (
              <div className="bg-emerald-50 border-t border-emerald-100 p-4 text-center">
                <span className="flex items-center justify-center gap-2 text-emerald-700 text-sm font-bold">
                  <CheckCircle2 size={16} /> Document officially verified by BIT Administration
                </span>
              </div>
            )}
            {viewingDoc.status === "rejected" && (
              <div className="bg-red-50 border-t border-red-100 p-4 shrink-0 flex items-center justify-between">
                <span className="flex items-center gap-2 text-red-700 text-sm font-bold">
                  <AlertCircle size={16} /> Document Rejected: {viewingDoc.rejectionReason}
                </span>
                <button onClick={() => { setViewingDoc(null); handleUpload(viewingDoc.id); }} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors">
                  Re-upload Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN VIEW ────────────────────────────────────────────────────── */
function AdminDocuments() {
  const [activeTab, setActiveTab] = useState<"requests" | "submissions" | "forms">("submissions");
  const [requests, setRequests] = useStorage<DocRequest[]>("bit_document_requests", INITIAL_REQUESTS);
  const [submissions, setSubmissions] = useStorage<Submission[]>("bit_document_submissions", INITIAL_SUBMISSIONS);
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [newReq, setNewReq] = useState({ docName: "", category: "Academic", targetYear: "All", targetDept: "All", deadline: "", note: "" });

  const filteredSubs = submissions.filter(s => {
    const ms = !search || s.studentName.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()) || s.docName.toLowerCase().includes(search.toLowerCase());
    const mf = subFilter === "all" || s.status === subFilter;
    return ms && mf;
  });

  const verifyDoc = (id: number) => {
    setSubmissions(p => p.map(s => s.id === id ? { ...s, status: "verified" as const } : s));
  };

  const rejectDoc = (id: number) => {
    setSubmissions(p => p.map(s => s.id === id ? { ...s, status: "rejected" as const, rejectionReason: rejectReason } : s));
    setShowRejectModal(null); setRejectReason("");
  };

  const deleteRequest = (id: number) => {
    setRequests(p => p.filter(r => r.id !== id));
  };

  const addRequest = () => {
    if (!newReq.docName || !newReq.deadline) return;
    const req: DocRequest = {
      id: Date.now(),
      ...newReq,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    setRequests(p => [...p, req]);
    setShowAddRequest(false); setNewReq({ docName: "", category: "Academic", targetYear: "All", targetDept: "All", deadline: "", note: "" });
  };

  const stats = {
    pending: submissions.filter(s => s.status === "pending").length,
    verified: submissions.filter(s => s.status === "verified").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  const SUBST: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: { label: "Pending Review", color: "#D97706", bg: "rgba(217,119,6,0.1)", icon: <FileClock size={13} /> },
    verified: { label: "Verified", color: "#059669", bg: "rgba(5,150,105,0.1)", icon: <FileCheck size={13} /> },
    rejected: { label: "Rejected", color: "#DC2626", bg: "rgba(220,38,38,0.1)", icon: <FileX size={13} /> },
  };

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="rounded-[2.5rem] p-8 mb-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg, #1a0a3a 0%, #2d1060 100%)" }}>
        <div className="relative z-10">
          <p className="text-purple-300 text-[10px] mb-2 tracking-[0.2em] font-bold uppercase">Admin Panel</p>
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Document Management</h1>
          <p className="text-indigo-100/90 text-sm font-medium">Review student submissions, request documents, and manage forms library.</p>
          <div className="flex gap-6 mt-6">
            {[{ l: "Pending Review", v: stats.pending, c: "#fbbf24" }, { l: "Verified", v: stats.verified, c: "#34d399" }, { l: "Rejected", v: stats.rejected, c: "#f87171" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-xl" style={{ fontWeight: 800, color: s.c }}>{s.v}</p>
                <p className="text-white/60 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
        {([
          { key: "submissions", label: "Student Submissions", icon: <Inbox size={15} />, count: stats.pending },
          { key: "requests", label: "Document Requests", icon: <ClipboardList size={15} />, count: requests.length },
          { key: "forms", label: "Forms Library", icon: <FolderOpen size={15} />, count: 0 },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: activeTab === tab.key ? "#5540DE" : "transparent",
              color: activeTab === tab.key ? "white" : "var(--muted-foreground)",
              fontWeight: activeTab === tab.key ? 600 : 500,
            }}>
            {tab.icon}{tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                style={{ background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "rgba(85,64,222,0.15)", color: activeTab === tab.key ? "white" : "#5540DE", fontWeight: 700 }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Student Submissions ── */}
      {activeTab === "submissions" && (
        <div>
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3 flex-1 min-w-52 rounded-[1.5rem] px-5 py-3 bento-card shadow-sm transition-all focus-within:shadow-md">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student, roll no, document…" className="flex-1 bg-transparent outline-none text-sm font-medium text-[var(--foreground)]" />
            </div>
            <div className="flex gap-1.5">
              {(["all", "pending", "verified", "rejected"] as const).map(k => (
                <button key={k} onClick={() => setSubFilter(k)}
                  className="px-3 py-2 rounded-xl text-xs capitalize transition-all"
                  style={{ background: subFilter === k ? "#5540DE" : "var(--glass-bg)", color: subFilter === k ? "white" : "var(--muted-foreground)", fontWeight: subFilter === k ? 600 : 500, border: `1px solid ${subFilter === k ? "transparent" : "var(--glass-border)"}` }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {filteredSubs.map(sub => {
              const sc = SUBST[sub.status];
              return (
                <GlassCard key={sub.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg,#5540DE,#7c6de8)", fontSize: "13px", fontWeight: 700 }}>
                      {sub.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{sub.studentName}</p>
                        <span className="text-xs text-muted-foreground">{sub.rollNo} · {sub.department}</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        📄 {sub.docName} · {sub.fileName} · {sub.size}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Uploaded: {sub.uploadedAt}</p>
                      {sub.rejectionReason && (
                        <p className="text-[11px] mt-1 text-red-500">Reason: {sub.rejectionReason}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: sc.bg, color: sc.color, fontWeight: 600 }}>
                        {sc.icon}{sc.label}
                      </span>
                      {sub.status === "pending" && (
                        <>
                          <button onClick={() => verifyDoc(sub.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs hover:opacity-90 transition-opacity"
                            style={{ background: "#059669", fontWeight: 600 }}>
                            <FileCheck size={12} /> Verify
                          </button>
                          <button onClick={() => { setShowRejectModal(sub.id); setRejectReason(""); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs hover:opacity-90 transition-opacity"
                            style={{ background: "#DC2626", fontWeight: 600 }}>
                            <FileX size={12} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
            {filteredSubs.length === 0 && (
              <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
                <Inbox size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No submissions match your filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Document Requests ── */}
      {activeTab === "requests" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{requests.length} active requests</p>
            <button onClick={() => setShowAddRequest(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: "#5540DE", fontWeight: 600 }}>
              <Plus size={15} /> New Request
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {requests.map(r => (
              <GlassCard key={r.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: "rgba(85,64,222,0.1)" }}>📋</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{r.docName}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Year: <strong>{r.targetYear}</strong></span>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Dept: <strong>{r.targetDept}</strong></span>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Category: <strong>{r.category}</strong></span>
                      <span className="text-xs text-red-500">Deadline: <strong>{r.deadline}</strong></span>
                    </div>
                    {r.note && <p className="text-xs mt-1.5 p-2 rounded-lg" style={{ color: "var(--muted-foreground)", background: "var(--surface-inset)" }}>{r.note}</p>}
                    <p className="text-[11px] mt-1" style={{ color: "var(--muted-foreground)" }}>Created: {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  </div>
                  <button onClick={() => deleteRequest(r.id)} className="p-2 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </GlassCard>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
                <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No document requests yet. Create one above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Forms Library ── */}
      {activeTab === "forms" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Manage downloadable forms for students</p>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity" style={{ background: "#5540DE", fontWeight: 600 }}>
              <Plus size={15} /> Upload Form
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {COLLEGE_FORMS.map(form => (
              <GlassCard key={form.name} className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-2xl shadow-sm bg-[var(--surface-inset)]" style={{ border: "1px solid var(--bento-border)" }}>{form.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-base" style={{ fontWeight: 800, color: "var(--foreground)" }}>{form.name}</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>PDF • Available</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="p-2 rounded-lg transition-colors" style={{ background: "var(--surface-inset)" }} title="Download">
                    <Download size={13} style={{ color: "var(--muted-foreground)" }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Remove">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="glass-card-strong rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base" style={{ fontWeight: 700, color: "var(--foreground)" }}>Reject Document</h3>
              <button onClick={() => setShowRejectModal(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={16} /></button>
            </div>
            <p className="text-sm mb-3" style={{ color: "var(--muted-foreground)" }}>Provide a reason so the student knows what to correct:</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3} placeholder="e.g. Document is blurry, please re-upload a clearer scan…"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRejectModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => rejectDoc(showRejectModal)} disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: "#DC2626", fontWeight: 600 }}>Send Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Request Modal */}
      {showAddRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="glass-card-strong rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base" style={{ fontWeight: 700, color: "var(--foreground)" }}>New Document Request</h3>
              <button onClick={() => setShowAddRequest(false)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: "Document Name", key: "docName", type: "text", placeholder: "e.g. Medical Certificate" },
                { label: "Deadline", key: "deadline", type: "text", placeholder: "e.g. Mar 31, 2026" },
                { label: "Notes for students", key: "note", type: "text", placeholder: "Optional instructions…" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs mb-1 block" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(newReq as any)[f.key]}
                    onChange={e => setNewReq(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Target Year", key: "targetYear", options: ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"] },
                  { label: "Target Dept", key: "targetDept", options: ["All", "CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AI&ML", "AI&DS"] },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs mb-1 block" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>{f.label}</label>
                    <select value={(newReq as any)[f.key]} onChange={e => setNewReq(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddRequest(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)", fontWeight: 500 }}>Cancel</button>
              <button onClick={addRequest} disabled={!newReq.docName || !newReq.deadline}
                className="flex-1 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: "#5540DE", fontWeight: 600 }}>
                <Send size={14} className="inline mr-2" />Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN EXPORT ───────────────────────────────────────────────────── */
export function DocumentsPage() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDocuments /> : <StudentDocuments />;
}