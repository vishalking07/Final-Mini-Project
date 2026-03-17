import { useState } from "react";
import {
  ExternalLink, ChevronDown, ChevronUp, Phone, Mail, MapPin, MessageCircle,
  Plus, X, Send, Inbox, CheckCircle2, Clock, AlertCircle, Ticket, Search, Filter,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

import { useEffect } from "react";

/* ── Data ─────────────────────────────────────────────────────────── */
const portals = [
  { name: "BIT Main Website", url: "https://www.bitsathy.ac.in/", icon: "🌐", color: "#5540DE", desc: "Official website with news, events, and academic resources.", features: ["Latest News", "Admission Info", "Academic Programs", "Publications"] },
  { name: "BIP Portal", url: "https://bip.bitsathy.ac.in/", icon: "🏛️", color: "#059669", desc: "Integrated portal for results, fees, OD, and student services.", features: ["Semester Results", "Fee Payment", "OD Applications", "Attendance"] },
  { name: "Support Desk", url: "https://supportdesk.bitsathy.ac.in/", icon: "🎫", color: "#DC2626", desc: "IT support desk for raising and tracking helpdesk tickets.", features: ["Raise IT Tickets", "Track Status", "Email Support", "Knowledge Base"] },
  { name: "BIT Wiki", url: "https://wiki.bitsathy.ac.in/", icon: "📖", color: "#0891B2", desc: "Study materials, notes, project resources, and academic guides.", features: ["Study Materials", "Lab Manuals", "Project Resources", "Academic Guides"] },
];

const faqs = [
  { q: "How do I check my semester results?", a: "Log in to BIP Portal (bip.bitsathy.ac.in) with your roll number. Navigate to Academic › Results to view your semester-wise results." },
  { q: "How do I apply for an OD (On-Duty)?", a: "OD applications are submitted via BIP Portal. Go to Applications › OD Application, fill event details and submit for HoD approval." },
  { q: "How do I pay my semester fees?", a: "Pay online through BIP Portal under the Finance section. Net banking, UPI, and debit cards are accepted." },
  { q: "How do I raise an IT support ticket?", a: "Visit supportdesk.bitsathy.ac.in, log in with your college credentials, and click 'New Ticket' to describe your issue." },
  { q: "Where can I find study materials?", a: "Available on BIT Wiki (wiki.bitsathy.ac.in). Log in with your college email to access department-specific notes and resources." },
  { q: "How do I apply for a Transfer Certificate?", a: "Fill the TC form (available in Documents section), submit physically at the exam cell with required documents." },
  { q: "What is the minimum attendance requirement?", a: "Minimum 75% attendance is mandatory per subject to appear in end-semester exams. Students below 75% may be detained." },
  { q: "How do I access library resources?", a: "Library accessible on-campus with your student ID. E-resources (DELNET, EBSCO) accessible via college network or VPN." },
];

interface SupportTicket {
  id: number;
  subject: string;
  category: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  studentName?: string;
  rollNo?: string;
  adminNote?: string;
}

const TICKET_CATEGORIES = ["Technical", "Academic", "Financial", "Hostel", "Library", "Other"];
const STATUS_CONFIG: Record<SupportTicket["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  "open": { label: "Open", color: "#5540DE", bg: "rgba(85,64,222,0.1)", icon: <Ticket size={12} /> },
  "in-progress": { label: "In Progress", color: "#D97706", bg: "rgba(217,119,6,0.1)", icon: <Clock size={12} /> },
  "resolved": { label: "Resolved", color: "#059669", bg: "rgba(5,150,105,0.1)", icon: <CheckCircle2 size={12} /> },
  "closed": { label: "Closed", color: "#6b7280", bg: "rgba(107,114,128,0.1)", icon: <X size={12} /> },
};
const PRIORITY_CONFIG: Record<SupportTicket["priority"], { label: string; color: string }> = {
  "low": { label: "Low", color: "#059669" },
  "medium": { label: "Medium", color: "#D97706" },
  "high": { label: "High", color: "#DC2626" },
};

const INITIAL_TICKETS: SupportTicket[] = [
  { id: 1, subject: "BIP portal login not working", category: "Technical", description: "Cannot log into BIP portal since yesterday. Password reset not working either.", priority: "high", status: "in-progress", createdAt: "Feb 23, 2026", studentName: "Vishal S", rollNo: "21CS001", adminNote: "IT team is investigating – fix expected by tomorrow." },
  { id: 2, subject: "Fee payment receipt not generated", category: "Financial", description: "Paid fees on Feb 20 but receipt was not generated. Amount debited from account.", priority: "high", status: "open", createdAt: "Feb 22, 2026", studentName: "Priya R", rollNo: "21EC045" },
  { id: 3, subject: "Attendance discrepancy in CSE202", category: "Academic", description: "Attendance shows 68% but I have been attending regularly.", priority: "medium", status: "resolved", createdAt: "Feb 15, 2026", studentName: "Karthik M", rollNo: "21CS032", adminNote: "Corrected attendance updated in BIP portal." },
];

/* ── Student Support ────────────────────────────────────────────────── */
function StudentSupport() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem("bit_support_tickets");
    if (saved) return JSON.parse(saved);
    return INITIAL_TICKETS;
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "Technical", description: "", priority: "medium" as SupportTicket["priority"] });
  const [faqSearch, setFaqSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("bit_support_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const submitTicket = () => {
    if (!form.subject || !form.description) return;

    const newTicket: SupportTicket = {
      id: Date.now(),
      ...form,
      status: "open",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      studentName: user?.name,
      rollNo: user?.rollNo
    };

    setTickets(p => [...p, newTicket]);
    setShowForm(false);
    setForm({ subject: "", category: "Technical", description: "", priority: "medium" });
  };

  const filteredFaqs = faqs.filter(f => !faqSearch || f.q.toLowerCase().includes(faqSearch.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero */}
      <div className="rounded-[2.5rem] p-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg, #5540DE 0%, #2e2378 100%)" }}>
        <div className="relative z-10">
          <p className="text-indigo-200 text-xs mb-2 tracking-widest uppercase" style={{ fontWeight: 700 }}>Help Center</p>
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 800 }}>Support & Resources</h1>
          <p className="text-indigo-100/90 text-sm">Access BIT portals, raise a support ticket, or find answers in the FAQ.</p>
          <div className="flex gap-3 mt-6">
            <span className="px-4 py-1.5 rounded-full text-xs text-white shadow-sm" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 700 }}>
              📌 {tickets.filter(t => t.status === "open" || t.status === "in-progress").length} Active Ticket{tickets.filter(t => t.status === "open" || t.status === "in-progress").length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/5 blur-xl" />
        <div className="absolute right-24 -bottom-16 w-32 h-32 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* Official Portals */}
      <div>
        <h2 className="text-base mb-4 flex items-center gap-2" style={{ fontWeight: 700, color: "var(--foreground)" }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ background: "#5540DE" }} /> Official Portals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map(p => (
            <div key={p.name} className="bento-card-strong rounded-[2.5rem] overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group">
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}55)` }} />
              <div className="p-7">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-inner" style={{ background: `${p.color}15`, border: `1px solid ${p.color}20` }}>{p.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base" style={{ fontWeight: 800, color: "var(--foreground)" }}>{p.name}</h3>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{p.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />{f}
                    </div>
                  ))}
                </div>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
                  style={{ background: p.color, fontWeight: 600 }}>
                  Open Portal <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Tickets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base flex items-center gap-2" style={{ fontWeight: 700, color: "var(--foreground)" }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ background: "#DC2626" }} /> My Tickets
          </h2>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
            style={{ background: "#5540DE", fontWeight: 600 }}>
            <Plus size={15} /> Raise Ticket
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {tickets.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl" style={{ color: "var(--muted-foreground)" }}>
              <Ticket size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tickets yet. Raise one if you need help!</p>
            </div>
          ) : (
            tickets.map(t => {
              const sc = STATUS_CONFIG[t.status];
              const pc = PRIORITY_CONFIG[t.priority];
              return (
                <div key={t.id} className="bento-card rounded-[2.5rem] p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-sm" style={{ background: "var(--surface-inset)", border: "1px solid var(--bento-border)" }}>
                      <Ticket size={18} style={{ color: "#5540DE" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-base" style={{ fontWeight: 800, color: "var(--foreground)" }}>{t.subject}</p>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ background: pc.color + "15", color: pc.color, fontWeight: 700 }}>{pc.label} Priority</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{t.category} · Opened {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{t.description}</p>
                      {t.adminNote && (
                        <div className="mt-2 px-3 py-2 rounded-xl flex items-start gap-2" style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
                          <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                          <p className="text-xs" style={{ color: "#059669" }}>Admin: {t.adminNote}</p>
                        </div>
                      )}
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] shrink-0" style={{ background: sc.bg, color: sc.color, fontWeight: 600 }}>
                      {sc.icon}{sc.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h2 className="text-base flex items-center gap-2" style={{ fontWeight: 700, color: "var(--foreground)" }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ background: "#0891B2" }} /> FAQ
          </h2>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 glass-card min-w-0 flex-1 max-w-xs">
            <Search size={13} className="text-muted-foreground shrink-0" />
            <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)} placeholder="Search FAQs…" className="bg-transparent outline-none text-xs flex-1" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="bento-card rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all duration-500">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center gap-5 p-6 text-left hover:bg-muted/10 transition-colors">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg,#5540DE,#7c6de8)", fontWeight: 800 }}>{i + 1}</span>
                <span className="flex-1 text-sm" style={{ fontWeight: 700, color: "var(--foreground)" }}>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} style={{ color: "#5540DE" }} className="shrink-0" /> : <ChevronDown size={18} style={{ color: "var(--muted-foreground)" }} className="shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <p className="text-sm leading-relaxed pt-4" style={{ color: "var(--muted-foreground)" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && <p className="text-sm text-center py-6" style={{ color: "var(--muted-foreground)" }}>No FAQs matching your search.</p>}
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Phone, label: "Phone", lines: ["+91-4295-226001", "+91-4295-226002"], color: "#5540DE" },
          { icon: Mail, label: "Email", lines: ["info@bitsathy.ac.in", "admissions@bitsathy.ac.in"], color: "#059669" },
          { icon: MapPin, label: "Address", lines: ["BIT Sathyamangalam", "Erode – 638 401, TN"], color: "#DC2626" },
        ].map(c => (
          <div key={c.label} className="bento-card-strong rounded-[2.5rem] p-7 flex items-start gap-5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
            <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: c.color, border: `1px solid ${c.color}55` }}>
              <c.icon size={20} />
            </div>
            <div>
              <p className="text-base mb-1.5" style={{ fontWeight: 800, color: "var(--foreground)" }}>{c.label}</p>
              {c.lines.map((l, i) => <p key={i} className="text-sm" style={{ color: "var(--muted-foreground)" }}>{l}</p>)}
            </div>
          </div>
        ))}
      </div>

      {/* Raise Ticket Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="glass-card-strong rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base" style={{ fontWeight: 700, color: "var(--foreground)" }}>Raise a Support Ticket</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Subject *</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Brief summary of your issue…" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}>
                    {TICKET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as SupportTicket["priority"] }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }}>
                    {(["low", "medium", "high"] as const).map(p => <option key={p} className="capitalize">{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4} placeholder="Describe your issue in detail…"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)", fontWeight: 500 }}>Cancel</button>
              <button onClick={submitTicket} disabled={!form.subject || !form.description}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: "#5540DE", fontWeight: 600 }}>
                <Send size={14} /> Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Admin Support ────────────────────────────────────────────────────── */
function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem("bit_support_tickets");
    if (saved) return JSON.parse(saved);
    return INITIAL_TICKETS;
  });
  const [filter, setFilter] = useState<"all" | SupportTicket["status"]>("all");
  const [search, setSearch] = useState("");
  const [noteModal, setNoteModal] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    localStorage.setItem("bit_support_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const filtered = tickets.filter(t =>
    (filter === "all" || t.status === filter) &&
    (!search || t.studentName?.toLowerCase().includes(search.toLowerCase()) || t.rollNo?.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id: number, status: SupportTicket["status"]) => {
    setTickets(p => p.map(t => t.id === id ? { ...t, status } : t));
  };

  const addNote = (id: number) => {
    setTickets(p => p.map(t => t.id === id ? { ...t, adminNote: noteText } : t));
    setNoteModal(null); setNoteText("");
  };

  const counts = { open: tickets.filter(t => t.status === "open").length, "in-progress": tickets.filter(t => t.status === "in-progress").length, resolved: tickets.filter(t => t.status === "resolved").length };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="rounded-[2.5rem] p-8 relative overflow-hidden bento-card-strong border-none shadow-2xl" style={{ background: "linear-gradient(135deg, #1a0a3a 0%, #2d1060 100%)" }}>
        <div className="relative z-10">
          <p className="text-purple-300 text-xs mb-2 tracking-[0.2em] font-bold uppercase">Admin Panel</p>
          <h1 className="text-white text-4xl mb-3" style={{ fontWeight: 800 }}>Support Ticket Inbox</h1>
          <p className="text-indigo-100/90 text-sm">Review and manage student-raised support tickets.</p>
          <div className="flex gap-6 mt-6">
            {[{ l: "Open", v: counts.open, c: "#a78bfa" }, { l: "In Progress", v: counts["in-progress"], c: "#fbbf24" }, { l: "Resolved", v: counts.resolved, c: "#34d399" }].map(s => (
              <div key={s.l}>
                <p className="text-2xl" style={{ fontWeight: 800, color: s.c }}>{s.v}</p>
                <p className="text-white/80 text-xs" style={{ fontWeight: 600 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl z-0" />
        <div className="absolute right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl z-0" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48 rounded-xl px-4 py-2.5 glass-card">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or ticket…" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="flex gap-1.5">
          {([["all", "All"], ["open", "Open"], ["in-progress", "In Progress"], ["resolved", "Resolved"], ["closed", "Closed"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className="px-3 py-2 rounded-xl text-xs transition-all"
              style={{ background: filter === k ? "#5540DE" : "var(--glass-bg)", color: filter === k ? "white" : "var(--muted-foreground)", fontWeight: filter === k ? 600 : 500, border: `1px solid ${filter === k ? "transparent" : "var(--glass-border)"}` }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div className="flex flex-col gap-3">
        {filtered.map(t => {
          const sc = STATUS_CONFIG[t.status];
          const pc = PRIORITY_CONFIG[t.priority];
          return (
            <div key={t.id} className="bento-card-strong rounded-[2.5rem] p-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg,#5540DE,#7c6de8)", fontSize: "18px", fontWeight: 800 }}>
                  {t.studentName?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <p className="text-base" style={{ fontWeight: 800, color: "var(--foreground)" }}>{t.subject}</p>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ background: pc.color + "15", color: pc.color, fontWeight: 700 }}>{pc.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <strong style={{ color: "var(--foreground)" }}>{t.studentName}</strong> ({t.rollNo}) · {t.category} · {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-sm mt-2.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{t.description}</p>
                  {t.adminNote && (
                    <div className="mt-2 px-3 py-2 rounded-xl flex items-start gap-2" style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
                      <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                      <p className="text-xs" style={{ color: "#059669" }}>Note: {t.adminNote}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ background: sc.bg, color: sc.color, fontWeight: 600 }}>
                    {sc.icon}{sc.label}
                  </span>
                  <div className="flex gap-1">
                    {t.status === "open" && (
                      <button onClick={() => updateStatus(t.id, "in-progress")} className="px-2.5 py-1.5 rounded-lg text-xs hover:opacity-90" style={{ background: "#D97706", color: "white", fontWeight: 600 }}>Start</button>
                    )}
                    {(t.status === "open" || t.status === "in-progress") && (
                      <button onClick={() => updateStatus(t.id, "resolved")} className="px-2.5 py-1.5 rounded-lg text-xs hover:opacity-90" style={{ background: "#059669", color: "white", fontWeight: 600 }}>Resolve</button>
                    )}
                    <button onClick={() => { setNoteModal(t.id); setNoteText(t.adminNote ?? ""); }} className="px-2.5 py-1.5 rounded-lg text-xs hover:opacity-90" style={{ background: "var(--surface-inset)", color: "var(--muted-foreground)", fontWeight: 600 }}>Note</button>
                    {t.status === "resolved" && (
                      <button onClick={() => updateStatus(t.id, "closed")} className="px-2.5 py-1.5 rounded-lg text-xs hover:opacity-90" style={{ background: "var(--surface-inset)", color: "var(--muted-foreground)", fontWeight: 600 }}>Close</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
            <Inbox size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tickets match your filter.</p>
          </div>
        )}
      </div>

      {/* Note modal */}
      {noteModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="glass-card-strong rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base" style={{ fontWeight: 700, color: "var(--foreground)" }}>Admin Note</h3>
              <button onClick={() => setNoteModal(null)} className="p-1.5 rounded-lg hover:bg-muted/50"><X size={16} /></button>
            </div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder="Add a note visible to the student…"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-4"
              style={{ background: "var(--input-background)", border: "1px solid var(--glass-border)", color: "var(--foreground)" }} />
            <div className="flex gap-3">
              <button onClick={() => setNoteModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: "var(--surface-inset)", color: "var(--foreground)", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => addNote(noteModal)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm hover:opacity-90" style={{ background: "#5540DE", fontWeight: 600 }}>
                <Send size={14} /> Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Export ─────────────────────────────────────────────────────────── */
export function SupportPage() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminSupport /> : <StudentSupport />;
}